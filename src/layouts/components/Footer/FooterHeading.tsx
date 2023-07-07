const FooterHeading = ({ name, className }: { name: string; className?: string }) => {
  return <h3 className={`font-semibold text-sm uppercase mb-2 text-[#111111] ${className}`}>{name}</h3>;
};

export default FooterHeading;
