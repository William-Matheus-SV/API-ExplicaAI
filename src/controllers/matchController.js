const Match = require ("../models/Match");
const Agenda = require("../models/Agenda");
const Tutor = require("../models/Tutor");
const Usuario = require("../models/Usuario");

const criarMatch = async (req, res) => {
    try {
        if(req.usuario.tipo !== "aluno") {
            return res.status(403).json({ error: "Apenas alunos podem criar matches" });
        }

        const alunoId = req.usuario.id;
        const {tutorId, agendaSlotId, materia} = req.body;

        if(!tutorId || !agendaSlotId || !materia) {
            return res.status(400).json({ message: "TutorId, agendaSlotId e materia são obrigatórios" });
        }

        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ message: "Tutor não encontrado" });
        }

        if (!tutor.materiasLecionadas.includes(materia)) {
        return res.status(400).json({ message: "Este tutor não leciona a matéria informada" });
        }

        const agendaSlot = await Agenda.findById(agendaSlotId);
        if(!agendaSlot){
            return res.status(404).json({ message: "Slot de agenda não encontrado" });
        }

        if (agendaSlot.tutorId.toString() !== tutorId) {
            return res.status(400).json({ message: "O slot de agenda não pertence ao tutor especificado" }); 
        }

        if(agendaSlot.status !== 'disponivel') {
            return res.status(409).json({ message: "Este horário não está mais disponível" });
        }

        // Verifica se o Aluno já tem outra aula confirmada que se sobrepõe a esse horário
        const inicioNovo = agendaSlot.dataHorarioInicio;
        const fimNovo = new Date(inicioNovo.getTime() + agendaSlot.duracao * 60 * 60 * 1000);

        const matchesDoAluno = await Match.find({
            alunoId,
            status: "confirmado"
        }).populate("agendaSlotId", "dataHorarioInicio duracao");

        const temConflito = matchesDoAluno.some((m) => {
            if (!m.agendaSlotId) return false;
            const inicioExistente = m.agendaSlotId.dataHorarioInicio;
            const fimExistente = new Date(inicioExistente.getTime() + m.agendaSlotId.duracao * 60 * 60 * 1000);
            return inicioNovo < fimExistente && inicioExistente < fimNovo;
        });

        if (temConflito) {
            return res.status(409).json({ message: "Você já tem uma aula marcada que conflita com esse horário" });
        }

        const match = await Match.create({
            alunoId: alunoId,
            tutorId: tutorId,
            agendaSlotId: agendaSlotId,
            materia: materia,
            dataHoraAgendada: agendaSlot.dataHorarioInicio,
            // status: não passar - o default "confirmado" já está no Schema
        });
        // Agora atualizar o slot
        agendaSlot.status = "reservado";
        await agendaSlot.save();

        res.status(201).json({ message: "Match criado com sucesso", 
            match: {
                id: match._id,
                alunoId: match.alunoId,
                tutorId: match.tutorId,
                agendaSlotId: match.agendaSlotId,
                materia: match.materia,
                dataHoraAgendada: match.dataHoraAgendada,
                status: match.status
            }
        
        });

    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o match" });
    }
};

const listarProximosDoAluno = async (req, res) => {
    try {
        if (req.usuario.tipo !== "aluno") {
            return res.status(403).json({ error: "Apenas alunos podem acessar esta lista" });
        }

        const alunoId = req.usuario.id;

        const matches = await Match.find({
            alunoId: alunoId,
            dataHoraAgendada: { $gte: new Date() }, // só datas a partir de agora
            status: "confirmado" // ainda não aconteceu
        })
            .sort({ dataHoraAgendada: 1 }) // mais próximos primeiro
            .limit(2)
            .populate("tutorId", "nome materiasLecionadas"); // traz alguns dados do Tutor junto

        res.status(200).json({ matches });

    } catch (error) {
        res.status(500).json({ error: "Erro ao listar próximos matches" });
    }
};

// ===================================================================
// LISTAR ÚLTIMOS MATCHES REALIZADOS DO TUTOR — só leitura
// ===================================================================
const listarRealizadosDoTutor = async (req, res) => {
    try {
        if (req.usuario.tipo !== "tutor") {
            return res.status(403).json({ error: "Apenas tutores podem acessar esta lista" });
        }

        const tutorId = req.usuario.id;

        const matches = await Match.find({
            tutorId: tutorId,
            status: "realizado"
        })
            .sort({ dataHoraAgendada: -1 }) // mais recentes primeiro
            .limit(2)
            .populate("alunoId", "nome");

        res.status(200).json({ matches });

    } catch (error) {
        res.status(500).json({ error: "Erro ao listar matches realizados" });
    }
};

// ===================================================================
// CANCELAR MATCH — Aluno ou Tutor, até 2h antes do horário marcado
// ===================================================================
const cancelarMatch = async (req, res) => {
    try {
        const { id } = req.params;

        const match = await Match.findById(id);
        if (!match) {
            return res.status(404).json({ message: "Match não encontrado" });
        }

        // Confere se quem está cancelando é realmente parte deste Match
        const ehAluno = req.usuario.tipo === "aluno" && match.alunoId.toString() === req.usuario.id;
        const ehTutor = req.usuario.tipo === "tutor" && match.tutorId.toString() === req.usuario.id;

        if (!ehAluno && !ehTutor) {
            return res.status(403).json({ message: "Você não tem permissão para cancelar este match" });
        }

        if (match.status !== "confirmado") {
            return res.status(409).json({ message: "Este match não pode mais ser cancelado" });
        }

        // Regra das 2h antes do horário marcado
        const agora = new Date();
        const duasHorasAntes = new Date(match.dataHoraAgendada.getTime() - 2 * 60 * 60 * 1000);
        if (agora > duasHorasAntes) {
            return res.status(409).json({ message: "Cancelamento não permitido a menos de 2h do horário marcado" });
        }

        match.status = "cancelado";
        await match.save();

        // Slot volta a ficar disponível para outro Aluno reservar
        const agendaSlot = await Agenda.findById(match.agendaSlotId);
        if (agendaSlot) {
            agendaSlot.status = "disponivel";
            await agendaSlot.save();
        }

        res.status(200).json({ message: "Match cancelado com sucesso" });

    } catch (error) {
        res.status(500).json({ error: "Erro ao cancelar o match" });
    }
};

// ===================================================================
// CONFIRMAR PRESENÇA — Aluno ou Tutor, basta 1 confirmação para virar "realizado"
// ===================================================================
const confirmarPresenca = async (req, res) => {
    try {
        const { id } = req.params;

        const match = await Match.findById(id);
        if (!match) {
            return res.status(404).json({ message: "Match não encontrado" });
        }

        const ehAluno = req.usuario.tipo === "aluno" && match.alunoId.toString() === req.usuario.id;
        const ehTutor = req.usuario.tipo === "tutor" && match.tutorId.toString() === req.usuario.id;

        if (!ehAluno && !ehTutor) {
            return res.status(403).json({ message: "Você não tem permissão para confirmar este match" });
        }

        if (match.status !== "confirmado") {
            return res.status(409).json({ message: "Este match não está mais aguardando confirmação" });
        }

        // Marca a confirmação de quem chamou a rota
        if (ehAluno) {
            match.confirmacaoAluno = true;
        }
        if (ehTutor) {
            match.confirmacaoTutor = true;
        }

        // Regra fechada: uma confirmação já basta para virar "realizado"
        if (match.confirmacaoAluno || match.confirmacaoTutor) {
            match.status = "realizado";
        }

        await match.save();

        res.status(200).json({
            message: "Presença confirmada com sucesso",
            match: {
                id: match._id,
                status: match.status,
                confirmacaoAluno: match.confirmacaoAluno,
                confirmacaoTutor: match.confirmacaoTutor
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Erro ao confirmar presença" });
    }
};
// ===================================================================
// LISTAR SEMANA DO ALUNO — todos os matches da semana atual (seg a sex),
// qualquer status, pra montar a tela de agenda completa
// ===================================================================
const listarSemanaDoAluno = async (req, res) => {
    try{
        if (req.usuario.tipo !== "aluno") {
            return res.status(403).json ({ error: "Apenas alunos podem acessar esta lista" });
        }
        const alunoId = req.usuario.id;
        // Calcula segunda 00:00 e sexta 23:59 da semana atual
        const hoje = new Date();
        const diaSemana = hoje.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
        let diferencaParaSegunda;
            if (diaSemana === 0) {
                diferencaParaSegunda = 1; // domingo → amanhã já é segunda
            } else if (diaSemana === 6) {
                diferencaParaSegunda = 2; // sábado → depois de amanhã é segunda
            } else {
                diferencaParaSegunda = 1 - diaSemana; // dia de semana normal, segunda dessa mesma semana
            }

        const inicioSemana = new Date (hoje);
        inicioSemana.setDate(hoje.getDate() + diferencaParaSegunda);
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date (inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 4); // sexta
        fimSemana.setHours(23, 59, 59, 999);

        const matches = await Match.find({
            alunoId,
            dataHoraAgendada : { $gte: inicioSemana, $lte: fimSemana }
        })
            .sort({ dataHoraAgendada: 1})
            .populate("tutorId", "nome")
            .populate("agendaSlotId", "duracao");
        res.status(200).json ({ matches });
    } catch (error){
        res.status(500).json({ error: "Erro ao listar semana do aluno" });
    }
};

// ===================================================================
// ESTATÍSTICAS DE MATCHES — funciona tanto pra Aluno quanto pra Tutor,
// dependendo do tipo presente no token (req.usuario.tipo)
// ===================================================================
const listarEstatisticas = async (req, res) => {
    try {
        const tipo = req.usuario.tipo;

        if (tipo !== "aluno" && tipo !== "tutor") {
            return res.status(403).json({ error: "Tipo de usuário inválido para esta consulta" });
        }

        // Monta o filtro base dependendo de quem está pedindo:
        // Aluno consulta pelos matches em que ele é o alunoId,
        // Tutor consulta pelos matches em que ele é o tutorId.
        const campoFiltro = tipo === "aluno" ? "alunoId" : "tutorId";
        const filtroBase = { [campoFiltro]: req.usuario.id };

        const aulasConcluidas = await Match.countDocuments({
            ...filtroBase,
            status: "realizado"
        });

        const aulasAgendadas = await Match.countDocuments({
            ...filtroBase,
            status: "confirmado"
        });

        res.status(200).json({ aulasConcluidas, aulasAgendadas });

    } catch (error) {
        console.error("Erro ao listar estatísticas:", error);
        res.status(500).json({ error: "Erro ao listar estatísticas" });
    }
};

module.exports = {
    criarMatch,
    listarProximosDoAluno,
    listarRealizadosDoTutor,
    cancelarMatch,
    confirmarPresenca,
    listarEstatisticas,
    listarSemanaDoAluno
};