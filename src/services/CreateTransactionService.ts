import Transaction from "../models/Transaction";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface Request {
    title: string;
    value: number;
    type: "income" | "outcome";
}

class CreateTransactionService {
    private transactionsRepository: TransactionsRepository;

    constructor(transactionsRepository: TransactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public execute({ title, value, type }: Request): Transaction {
        if (!["income", "outcome"].includes(type)) {
            throw new Error("Esse tipo de transação é inválido");
        }

        const { total } = this.transactionsRepository.getBalance();

        if (type === "outcome" && total < value) {
            throw new Error(
                "Você não tem saldo suficiente para essa transação!",
            );
        }

        const transaction = this.transactionsRepository.create({
            title,
            value,
            type,
        });

        return transaction;
    }
}

export default CreateTransactionService;
