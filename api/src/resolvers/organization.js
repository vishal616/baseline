import { pubsub } from '../subscriptions';
import {
  getInterfaceAddress,
  registerToOrgRegistry,
  listOrganizations,
  getOrganizationCount,
  getRegisteredOrganization
} from '../services/organization';

import { getServerSettings } from '../db/models/baseline/server/settings';

import {
  getOrganizationById,
  getAllOrganizations,
  getAllPartners,
  setPartner,
  getPartnerByAddress,
  getPartnerByIdentity,
} from '../db/models/baseline/organizations';

const PARTNERS_UPDATE = 'PARTNERS_UPDATE';
const ORGANIZATION_PARTNER_LIST_UPDATE = 'ORGANIZATION_PARTNER_LIST_UPDATE';

export default {
  Query: {
    organization(_parent, args) {
      return getOrganizationById(args.address).then(res => res);
    },
    organizations() {
      console.log('getting all organizations');
      return getAllOrganizations();
    },
    organizationList(_parent, args) {
      return listOrganizations(args.start, args.count);
    },
    registeredOrganization(_parent, args) {
      return getRegisteredOrganization(args.address);
    },
    organizationCount() {
      return getOrganizationCount();
    },
    orgRegistryAddress(_parent, args) {
      return getInterfaceAddress(args.registrarAddress, args.managerAddress, 'IOrgRegistry');
    },
    partner(_parent, args) {
      return getPartnerByAddress(args.address).then(res => res);
    },
    getPartnerByIdentity(_parent, args) {
      return getPartnerByIdentity(args.identity).then(res => res);
    },
    partners() {
      return getAllPartners();
    },
  },
  Organization: {
    name: root => root.name,
    address: root => root.address,
    role: root => root.role,
  },
  Mutation: {
    registerOrganization: async (_root, args) => {
      const settings = await getServerSettings();
      const { organizationWhisperKey, organizationAddress } = settings;

      const orgRegistryTxHash = await registerToOrgRegistry(
        organizationAddress,
        args.organizationName,
        args.organizationRole,
        organizationWhisperKey,
      );

      console.log('Registering Organization with tx:', orgRegistryTxHash);
    },
    addPartner: async (_parent, args) => {
      const { address } = args.input;
      await setPartner(address, true);
      const partners = await getAllPartners();
      const organizations = await getAllOrganizations();
      pubsub.publish(ORGANIZATION_PARTNER_LIST_UPDATE, {
        organizationPartnerListUpdate: { organizations, partners },
      });
      return partners;
    },
    removePartner: async (_parent, args) => {
      const { address } = args.input;
      await setPartner(address, false);
      const partners = await getAllPartners();
      const organizations = await getAllOrganizations();
      pubsub.publish(ORGANIZATION_PARTNER_LIST_UPDATE, {
        organizationPartnerListUpdate: { organizations, partners },
      });
      return partners;
    },
  },
  Subscription: {
    organizationPartnerListUpdate: {
      subscribe: () => {
        return pubsub.asyncIterator(ORGANIZATION_PARTNER_LIST_UPDATE);
      },
    },
    getPartnerUpdate: {
      subscribe: () => {
        return pubsub.asyncIterator(PARTNERS_UPDATE);
      },
    },
  },
};
