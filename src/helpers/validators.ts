const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }
  const digits = cleaned.split("").map(Number);

  let sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== digits[9]) return false;

  sum = digits.slice(0, 10).reduce((acc, d, i) => acc + d * (11 - i), 0);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === digits[10];
};

const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14 || /^(\d)\1{13}$/.test(cleaned)) {
    return false;
  }
  const digits = cleaned.split("").map(Number);

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = digits.slice(0, 12).reduce((acc, d, i) => acc + d * weights1[i], 0);
  let rev = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (rev !== digits[12]) return false;

  sum = digits.slice(0, 13).reduce((acc, d, i) => acc + d * weights2[i], 0);
  rev = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return rev === digits[13];
};

export const validateDocument = (value: string): boolean => {
  const doc = value.replace(/\D/g, "");
  if (doc.length === 11) {
    return validateCPF(doc);
  } else if (doc.length === 14) {
    return validateCNPJ(doc);
  }
  return false;
};
