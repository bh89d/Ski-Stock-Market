import { Link } from "react-router-dom";
import { getCompany } from "../api/api.ts";
import type { companyDTO } from "../api/api.ts";
import { useEffect, useState } from "react";
import { HeaderCompanyListPage } from "../components/header.tsx";

export function CompanyList() {
  const [company, setCompany] = useState<companyDTO[]>();

  useEffect(() => {
    async function fetchCompany() {
      const data = await getCompany();
      setCompany(data);
    }

    fetchCompany();
  }, []);

  return (
    <>
      <HeaderCompanyListPage />
      <div className="flex justify-center items-center flex-col h-screen">
        {company?.map((option) => {
          return (
            <Link key={option.companyId} to={`/company/${option.companyId}`}>
              <button className="border-2 p-2 m-2 rounded-sm cursor-pointer">{option.companyName}</button>
            </Link>
          );
        })}
      </div>
    </>
  );
}
