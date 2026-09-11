const Avaliacao = require("../models/Avaliacao");
const Match = require("../models/Match");

// ===================================================================
// CRIAR AVALIAÇÃO — Aluno ou Tutor avaliando o outro lado de um match
// ===================================================================
const criarAvaliacao = async (req, res) => {
    try {
        const { matchId, nota, comentario } = req.body;

        if (!matchId || !nota) {
            return res.status(400).json({ message: "matchId e nota são obrigatórios" });
        }

        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: "Match não encontrado" });
        }

        const ehAluno = req.usuario.tipo === "aluno" && match.alunoId.toString() === req.usuario.id;
        const ehTutor = req.usuario.tipo === "tutor" && match.tutorId.toString() === req.usuario.id;

        if (!ehAluno && !ehTutor) {
            return res.status(403).json({ message: "Você não tem permissão para avaliar este match" });
        }

        if (match.status !== "realizado") {
            return res.status(409).json({ message: "Só é possível avaliar matches já realizados" });
        }

        const avaliadorId = req.usuario.id;
        const avaliadorTipo = req.usuario.tipo;
        const avaliadoId = ehAluno ? match.tutorId : match.alunoId;
        const avaliadoTipo = ehAluno ? "tutor" : "aluno";

        const avaliacao = await Avaliacao.create({
            matchId,
            avaliadorId,
            avaliadorTipo,
            avaliadoId,
            avaliadoTipo,
            nota,
            comentario
        });

        res.status(201).json({ message: "Avaliação registrada com sucesso", avaliacao });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Você já avaliou este match" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Erro ao criar avaliação:", error);
        res.status(500).json({ message: "Erro ao criar avaliação" });
    }
};

// ===================================================================
// LISTAR AVALIAÇÕES RECEBIDAS — o próprio usuário logado vê o que falaram dele
// ===================================================================
const listarMinhasAvaliacoes = async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.find({
            avaliadoId: req.usuario.id,
            avaliadoTipo: req.usuario.tipo
        }).sort({ createdAt: -1 });

        const media = avaliacoes.length > 0
            ? avaliacoes.reduce((soma, av) => soma + av.nota, 0) / avaliacoes.length
            : null;

        res.status(200).json({ media, total: avaliacoes.length, avaliacoes });

    } catch (error) {
        console.error("Erro ao listar avaliações:", error);
        res.status(500).json({ message: "Erro ao listar avaliações" });
    }
};

// ===================================================================
// LISTAR AVALIAÇÕES DE UM TUTOR — rota pública, Aluno consulta antes de escolher
// ===================================================================
const listarAvaliacoesDoTutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        const avaliacoes = await Avaliacao.find({
            avaliadoId: tutorId,
            avaliadoTipo: "tutor"
        }).sort({ createdAt: -1 });

        const media = avaliacoes.length > 0
            ? avaliacoes.reduce((soma, av) => soma + av.nota, 0) / avaliacoes.length
            : null;

        res.status(200).json({ media, total: avaliacoes.length, avaliacoes });

    } catch (error) {
        console.error("Erro ao listar avaliações do tutor:", error);
        res.status(500).json({ message: "Erro ao listar avaliações do tutor" });
    }
};
// ===================================================================
// MINHAS AVALIAÇÕES ENVIADAS — o usuário logado vê o que ele mesmo avaliou
// ===================================================================
const listarEnviadas = async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.find({
            avaliadorId: req.usuario.id,
            avaliadorTipo: req.usuario.tipo
        }).sort({ createdAt: -1 });

        res.status(200).json({ avaliacoes });

    } catch (error) {
        console.error("Erro ao listar avaliações enviadas:", error);
        res.status(500).json({ message: "Erro ao listar avaliações enviadas" });
    }
};
// ===================================================================
// LISTAR AVALIAÇÕES PENDENTES — matches "realizado" que o usuário
// logado ainda não avaliou
// ===================================================================
const listarPendentes = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const tipo = req.usuario.tipo;

        if (tipo !== "aluno" && tipo !== "tutor") {
            return res.status(403).json({ error: "Tipo de usuário inválido para esta consulta" });
        }

        const avaliacoesFeitas = await Avaliacao.find({
            avaliadorId: usuarioId
        }).select("matchId");

        const matchIdsJaAvaliados = avaliacoesFeitas.map((av) => av.matchId);

        const campoFiltro = tipo === "aluno" ? "alunoId" : "tutorId";

        const matches = await Match.find({
            [campoFiltro]: usuarioId,
            status: "realizado",
            _id: { $nin: matchIdsJaAvaliados }
        })
            .sort({ dataHoraAgendada: -1 })
            .populate(tipo === "aluno" ? "tutorId" : "alunoId", "nome");

        const pendentes = matches.map((match) => {
            const outraParte = tipo === "aluno" ? match.tutorId : match.alunoId;

            return {
                matchId: match._id,
                nome: outraParte ? outraParte.nome : null,
                materia: match.materia,
                dataHoraAgendada: match.dataHoraAgendada
            };
        });

        res.status(200).json({ pendentes });

    } catch (error) {
        console.error("Erro ao listar avaliações pendentes:", error);
        res.status(500).json({ error: "Erro ao listar avaliações pendentes" });
    }
};

module.exports = {
    criarAvaliacao,
    listarMinhasAvaliacoes,
    listarAvaliacoesDoTutor,
    listarEnviadas,
    listarPendentes
};