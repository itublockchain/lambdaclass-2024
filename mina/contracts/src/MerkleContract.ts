import { SmartContract, state, State, MerkleWitness, Field } from 'o1js';

class MerkleWitness256 extends MerkleWitness(256) {}

const EMPTY_ROOT =
  Field(0x21afce36daa1a2d67391072035f4555a85aea7197e5830b128f121aa382770cdn);

export class MerkleContract extends SmartContract {
  @state(Field) public merkleRoot = State();

  init() {
    super.init();
    this.merkleRoot.set(EMPTY_ROOT);
  }

  public async updateMerkleRoot(
    newMerkleRoot: Field,
    witness: MerkleWitness256,
    addedLeaf: Field
  ) {
    witness.calculateRoot(addedLeaf).assertEquals(newMerkleRoot);
    this.merkleRoot.set(newMerkleRoot);
  }
}
