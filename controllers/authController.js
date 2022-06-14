import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import { insertNewSession } from "../repositories/sessionsRespository.js";
import { selectUserByEmail } from "../repositories/usersRepository.js";

export async function signIn(req, res){
    const { email, password } = req.body;
    try{
        const user = await selectUserByEmail(email);
        if(!user)return res.status(401).send("Email and password doesn't match!");
        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword) return res.status(401).send("Email and password doesn't match!");
        const token = uuid();
        await insertNewSession(user.id, token);
        delete user.createdAt;
        delete user.password;
        return res.status(200).send({...user, token});
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}