import Header from "../header/header";

export default function Layout({ children }: any) {
  return (
    <>
      <Header />
      {/* This is where the content of the pages will be rendered */}
      <main>{children}</main>
    </>
  );
}
