import gql from 'graphql-tag';

export default gql`
  extend type Query {
    organization(address: Address!): Organization
    organizations: [Organization]
    organizationList(start: Int!, count: Int!): Organizations
    registeredOrganization(address: Address!): RegisteredOrganization
    organizationCount: Int!
    orgRegistryAddress(registrarAddress: Address!, managerAddress: Address!): Address!
    partner(address: Address!): Organization
    partners: [Organization]
    getPartnerByIdentity(identity: String!): Organization
  }

  extend type Mutation {
    registerOrganization(input: RegisterOrganization!): OrganizationPayload
    addPartner(input: AddPartnerInput!): PartnerPayload
    removePartner(input: RemovePartnerInput!): PartnerPayload
  }

  extend type Subscription {
    newOrganization: Organization
    organizationPartnerListUpdate: OrganizationList
    getPartnerUpdate: PartnerPayload
  }

  type OrganizationList {
    organizations: [Organization]
    partners: [Organization]
  }

  type Organization {
    name: String!
    address: Address!
    role: Int!
    identity: String!
    zkpPublicKey: String!
    isPartner: Boolean!
  }

  input RegisterOrganization {
    name: String!
    role: Int!
  }

  type OrganizationPayload {
    organization: Organization
  }

  type RegisterToOrgRegistryPayload {
    transactionHash: String!
  }

  type RegisteredOrganization {
    name: String!
    address: Address!
    role: Int!
    identity: String!
    zkpPublicKey: String!
    isPartner: Boolean!
  }

  type Organizations {
    addresses: [Address!]!
    names: [String!]!
    roles: [Int!]!
    identities: [String!]!
    zkpPublicKeys: [String!]!
    isPartner: [Boolean]!
  }

  type Partners {
    addresses: [Address!]!
    names: [String!]!
    roles: [Int!]!
    identities: [String!]!
    isPartner: [Boolean]!
  }

  input AddPartnerInput {
    address: Address!
  }

  input RemovePartnerInput {
    address: Address!
  }

  type PartnerPayload {
    partner: Organization
  }
`;
