import { Link, useNavigate } from "react-router-dom";
import { getMarketClock, type companyWithStockDTO, type marketClockDTO } from "../api/api.ts";
import { useEffect, useState } from "react";
import { formatMarketClock } from "../utils/util.ts";

type HeaderCompanyPageProps = {
  company: companyWithStockDTO;
};

export function HeaderCompanyPage({ company }: HeaderCompanyPageProps) {
  const [time, setTime] = useState<marketClockDTO>();

  useEffect(() => {
    let isMounted = true;

    async function syncMarketClock() {
      try {
        const data = await getMarketClock();

        if (isMounted) {
          setTime(data);
        }
      } catch {
        if (isMounted) {
          setTime(undefined);
        }
      }
    }

    syncMarketClock();

    const backendSyncInterval = setInterval(() => {
      syncMarketClock();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(backendSyncInterval);
    };
  }, []);

  function displayTime() {
    if (time) {
      return formatMarketClock(time.currentMarketTick);
    }

    return ("Cannot fetch Market Clock");
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between border-b-2 bg-white">
      <div className="pl-5">
        <div className="font-bold text-2xl">
          {company.companyName}
        </div>
        <div className="opacity-60">
          Industry - {company.industry}
        </div>
      </div>
      <div className="pr-5">
        <Link to="/home">
          Home
        </Link>
      </div>
      <div className="pr-5 text-right">
        <p>Time : {displayTime()}</p>
        <p>Market status : {time?.currentPhase}</p>
      </div>
    </div>
  )
}

export function HeaderCompanyListPage() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end pt-5">
      <button onClick={() => (navigate("/user/transactions"))} className="p-3 mr-5 font-bold cursor-pointer border rounded-sm"> Transactions </button>
      <button onClick={() => (navigate("/user/portfolio"))} className="p-3 mr-5 font-bold cursor-pointer border rounded-sm"> Portfolio </button>
    </div>
  )
}
