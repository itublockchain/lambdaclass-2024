import {
  SmartContract,
  state,
  State,
  MerkleWitness,
  Field,
  method,
} from 'o1js';

export class MerkleWitness256 extends MerkleWitness(256) {}

export class MerkleContract extends SmartContract {
  @state(Field) merkleRoot = State<Field>();

  init() {
    super.init();
    this.merkleRoot.set(Field(22731122946631793544306773678309960639073656601863129978322145324846701682624n));
  }

  @method async updateMerkleRoot(witness: MerkleWitness256) {
    const currentTreeRoot = this.merkleRoot.getAndRequireEquals();
    currentTreeRoot.assertEquals(
      witness.calculateRoot(Field(0)),
      'Transaction added.'
    );
    this.merkleRoot.set(witness.calculateRoot(Field(1)));
  }
}
