import { Field, MerkleTree, Mina, PrivateKey, PublicKey, UInt64, MerkleWitness } from "o1js";
import { MerkleContract } from "./MerkleContract";

class MerkleWitness256 extends MerkleWitness(256) {}

describe("Example Airdrop zkApp", () => {
  let tree: MerkleTree;
  let senderKey: PrivateKey;
  let appKey: PrivateKey;
  let sender: PublicKey;
  let app: MerkleContract;

  beforeAll(() => MerkleContract.compile());

  beforeEach(() =>
    Mina.LocalBlockchain({ proofsEnabled: true }).then((local) => {
      tree = new MerkleTree(256);
      console.log("Merkle tree created.", tree.getRoot());
      Mina.setActiveInstance(local);
      senderKey = local.testAccounts[0].key;
      sender = senderKey.toPublicKey();
      appKey = local.testAccounts[1].key;
      app = new MerkleContract(appKey.toPublicKey());

      const deployerKey = local.testAccounts[2].key;
      const deployer = deployerKey.toPublicKey();
      return Mina.transaction(deployer, () => app.deploy())
        .prove()
        .sign([appKey, deployerKey])
        .send();
    })
  );

  it("should deploy the app", () =>
    console.log("Deployed HumanIDs contract at", app.address.toBase58()));

  it("should let people claimReward()", () =>
    Mina.transaction(sender, () =>
      app.updateMerkleRoot(new MerkleWitness256(tree.getWitness(100n)))
    )
      .prove()
      .sign([senderKey])
      .send());
});