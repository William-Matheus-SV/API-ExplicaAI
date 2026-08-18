const Agenda = require("../models/Agenda");
const Tutor = require("../models/Tutor");

const verificarTutorAtivo = async (tutorId) => {
    const tutor = await Tutor.findById(tutorId);
    return !!tutor && tutor.status_aprovacao === "aprovado";
}
const criarSlot = async (req, res) => {
    try {
        if (req.usuario.tipo !== "tutor") {
            return res.status(403).json({ message: "Apenas tutores podem criar horários" });
        }

        const tutorId = req.usuario.id; // sempre do token, nunca do body
        
        if (!(await verificarTutorAtivo(req.usuario.id))) {
            return res.status(403).json({ message: "Conta não autorizada" });
        }
        const { dataHorarioInicio, duracao } = req.body;

        if (!dataHorarioInicio || !duracao) {
            return res.status(400).json({ message: "dataHorarioInicio e duracao são obrigatórios" });
        }

        const inicio = new Date(dataHorarioInicio);
        if (isNaN(inicio.getTime())) {
            return res.status(400).json({ message: "dataHorarioInicio inválida" });
        }

        // horaFim não existe no Schema (decisão de vocês), então calculamos aqui
        // toda vez que precisamos comparar intervalos
        const fim = new Date(inicio.getTime() + duracao * 60 * 60 * 1000);

        // Busca todos os slots do tutor para checar sobreposição manualmente.
        // Não é a query mais performática pra uma agenda com milhares de slots,
        // mas é simples de ler e o volume por tutor tende a ser pequeno (dezenas, não milhares)
        const slotsExistentes = await Agenda.find({ tutorId });

        const temSobreposicao = slotsExistentes.some((slot) => {
            const slotInicio = slot.dataHorarioInicio;
            const slotFim = new Date(slotInicio.getTime() + slot.duracao * 60 * 60 * 1000);
            // dois intervalos se sobrepõem se um começa antes do outro terminar, nos dois sentidos
            return inicio < slotFim && slotInicio < fim;
        });

        if (temSobreposicao) {
            return res.status(409).json({ message: "Já existe um horário cadastrado que se sobrepõe a este" });
        }

        const novoSlot = await Agenda.create({
            tutorId,
            dataHorarioInicio: inicio,
            duracao
        });

        res.status(201).json({ message: "Horário criado com sucesso", slot: novoSlot });

    } catch (error) {
        res.status(500).json({ error: "Erro ao criar horário" });
    }
};

// ===================================================================
// LISTAR MEUS SLOTS — Tutor vê a própria agenda da semana atual
// ===================================================================
const listarMeusSlots = async (req, res) => {
    try {
        if (req.usuario.tipo !== "tutor") {
            return res.status(403).json({ message: "Apenas tutores podem acessar esta lista" });
        }

        const tutorId = req.usuario.id;

        if (!(await verificarTutorAtivo(tutorId))) {
            return res.status(403).json({ message: "Conta não autorizada" });
        }

        // "semana atual" = hoje 00:00 até daqui 7 dias.
        // Isso é a versão simples do "reset semanal" que ainda está como débito técnico:
        // não reseta nada de verdade no banco, só recorta a janela de exibição.
        const inicioSemana = new Date();
        inicioSemana.setHours(0, 0, 0, 0);
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(fimSemana.getDate() + 7);

        const slots = await Agenda.find({
            tutorId,
            dataHorarioInicio: { $gte: inicioSemana, $lt: fimSemana }
        }).sort({ dataHorarioInicio: 1 });

        res.status(200).json({ slots });

    } catch (error) {
        res.status(500).json({ error: "Erro ao listar horários" });
    }
};

// ===================================================================
// REMOVER SLOT — apenas o próprio Tutor, e só se ainda estiver disponível
// ===================================================================
const removerSlot = async (req, res) => {
    try {
        if (req.usuario.tipo !== "tutor") {
            return res.status(403).json({ message: "Apenas tutores podem remover horários" });
        }

        if (!(await verificarTutorAtivo(req.usuario.id))) {
            return res.status(403).json({ message: "Conta não autorizada" });
        }

        const { id } = req.params;
        const slot = await Agenda.findById(id);

        if (!slot) {
            return res.status(404).json({ message: "Horário não encontrado" });
        }

        if (slot.tutorId.toString() !== req.usuario.id) {
            return res.status(403).json({ message: "Você não tem permissão para remover este horário" });
        }

        if (slot.status !== "disponivel") {
            return res.status(409).json({ message: "Não é possível remover um horário já reservado" });
        }

        // Delete físico mesmo (não soft delete) — ver explicação no final do arquivo
        await Agenda.findByIdAndDelete(id);

        res.status(200).json({ message: "Horário removido com sucesso" });

    } catch (error) {
        res.status(500).json({ error: "Erro ao remover horário" });
    }
};

// ===================================================================
// LISTAR SLOTS DE UM TUTOR — rota pública, Aluno consulta antes de reservar
// ===================================================================
const listarSlotsDoTutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        const slots = await Agenda.find({
            tutorId,
            status: "disponivel",
            dataHorarioInicio: { $gte: new Date() } // esconde horários que já passaram
        }).sort({ dataHorarioInicio: 1 });

        res.status(200).json({ slots });

    } catch (error) {
        res.status(500).json({ error: "Erro ao listar horários do tutor" });
    }
};

module.exports = {
    criarSlot,
    listarMeusSlots,
    removerSlot,
    listarSlotsDoTutor
};