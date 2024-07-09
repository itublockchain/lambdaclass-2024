import { ethers } from "ethers";
import { MerkleTree, Mina, PrivateKey, MerkleWitness, PublicKey, fetchAccount, UInt64, } from "o1js";
import { MerkleContract } from "../contracts/build/src/MerkleContract.js";
import dotenv from "dotenv";
dotenv.config();
console.log("Deneme: ", process.env.MINA_PRIV_KEY);
const senderPrivateKey = PrivateKey.fromBase58(process.env.MINA_PRIV_KEY);
const sender = senderPrivateKey.toPublicKey();
console.log("Sender address: ", sender.toBase58());
const MerkleContractCompiled = await MerkleContract.compile();
await fetchAccount({
    publicKey: "B62qned36oC5icMEA4FRxRvStii72XKyVnxaVCmNfV7PBdwUgYeSPn3",
});
const MerkleContractDeployed = new MerkleContract(PublicKey.fromBase58("B62qned36oC5icMEA4FRxRvStii72XKyVnxaVCmNfV7PBdwUgYeSPn3"));
const tree = new MerkleTree(256);
class MerkleWitness256 extends MerkleWitness(256) {
}
const provider = new ethers.providers.WebSocketProvider("ws://localhost:3051");
const Network = Mina.Network("https://api.minascan.io/node/devnet/v1/graphql");
Mina.setActiveInstance(Network);
await fetchAccount({ publicKey: sender });
console.log("Active Instance: ", Mina.activeInstance);
console.log("Balance: ", Mina.getBalance(sender).greaterThan(UInt64.from(0)));
provider.addListener("pending", async (transaction) => {
    console.log("Devnet network instance configured.");
    console.log("Transaction received:", transaction);
    const tx = await Mina.transaction(sender, async () => {
        await MerkleContractDeployed.updateMerkleRoot(new MerkleWitness256(tree.getWitness(100n)));
    });
    const signed = tx.sign([senderPrivateKey]);
    const proved = await signed.prove();
    const hash = await proved.send();
    console.log(hash.toPretty());
});
