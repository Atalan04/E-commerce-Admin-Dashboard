const e2p = (s: number | string): string => {
  return s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d);
};

const p2e = (s: number | String): string => {
  return s
    .toString()
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
};

const sp = (number: string | number): string => {
  //Gaurd Clause
  if (!number && number !== 0) return "۰";

  const seperatedNumber = number
    .toString()
    .match(/(\d+?)(?=(\d{3})+(?!\d)|$)/g);

  if (!seperatedNumber) return "۰";

  const joinedNumber = seperatedNumber.join(",");
  return e2p(joinedNumber);
};

export { e2p, p2e, sp };
