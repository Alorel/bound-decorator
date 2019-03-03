/** @internal */
export interface ProposalDescriptor extends PropertyDescriptor {
  descriptor: ProposalDescriptor; // Babel impl

  extras: Partial<ProposalDescriptor>[];

  key: string;

  kind: string;

  method: Function;

  placement: string;

  initialize(): any;

  initializer(): any;
}
