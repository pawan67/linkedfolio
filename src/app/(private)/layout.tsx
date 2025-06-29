import Header from "@/components/shared/header";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PrivateLayout;
