const REGEX = {
  PHONE_NUMBER: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
  NUMBER: /^\d+$/
} as const;

export default REGEX;
