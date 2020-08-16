export const filterPartners = (partners, filter) => {
  return partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      partner.companyFormName
        .toLowerCase()
        .includes(filter.companyFormName.toLowerCase()) &&
      partner.cityName.toLowerCase().includes(filter.cityName.toLowerCase())
  );
};
