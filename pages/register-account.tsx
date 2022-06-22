import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RegisterAccountForm from "@/components/register-account-form";

function RegisterAccount() {
  return <RegisterAccountForm />;
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default RegisterAccount;
