import Header from "@/components/shared/header";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className=" max-w-4xl mx-auto px-5">{children}</div>
    </>
  );
};

export default MarketingLayout;
