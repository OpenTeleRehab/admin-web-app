export const checkFederatedUser = (email) => {
  if (!email) return false;
  const federatedDomains = process.env.REACT_APP_FEDERATED_DOMAINS || '';
  return federatedDomains.split(',').some(domain => email && email.toLowerCase().endsWith(domain.trim().toLowerCase()));
};
