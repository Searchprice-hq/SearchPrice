"use client";

import { useState, useEffect } from "react";

const logisticsCosts: Record<string, number> = {
  full: 10,
  flex_and_places: 15,
  collects: 5,
  flex: 20,
  own_logistics: 8,
};

const adCosts: Record<string, number> = {
  classic: 5,
  premium: 12,
  free: 0,
};

export default function MiniCalculator() {
  const [open, setOpen] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [aliquot, setAliquot] = useState("0.04");
  const [logistics, setLogistics] = useState("");
  const [adType, setAdType] = useState("");
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Recalcula sempre que um campo muda
  useEffect(() => {
    if (!sellPrice || !buyPrice || !logistics || !adType || !aliquot) {
      setCalcResult(null);
      return;
    }
    const sp = parseFloat(sellPrice);
    const bp = parseFloat(buyPrice);
    const al = parseFloat(aliquot);
    const logCost = logisticsCosts[logistics] ?? 0;
    const adCost = adCosts[adType] ?? 0;
    const result = sp - logCost - adCost - bp - sp * al;
    setCalcResult(result);
  }, [sellPrice, buyPrice, logistics, adType, aliquot]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <>
      {/* Botão para abrir */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed right-4 top-[90%]
            bg-[var(--black-to-secondary)] text-white border border-white
            rounded-[20px] px-6 py-1 z-30 h-20
            hover:bg-secondary active:scale-90 transition
          "
        >
          <img src="/calculator.png" alt="Calculadora" width={50} height={50} />
        </button>
      )}

      {/* Painel da calculadora */}
      {open && (
        <div
          className="
            fixed bottom-5 right-5 w-[270px]
            bg-[var(--black-to-secondary)] rounded-lg p-5 z-[1000]
          "
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-3 text-white text-lg"
          >
            ✕
          </button>
          <h2 className="text-white font-semibold text-lg text-center mt-6">
            Calculadora
          </h2>

          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="sell_price" className="block text-white">
                Valor que deseja vender:
              </label>
              <input
                id="sell_price"
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="50"
                className="
                  w-full rounded-lg p-2
                  bg-[var(--input)] text-white placeholder:text-gray-400
                  focus:outline-none
                "
              />
            </div>
            <hr className="border-gray-600" />

            <div>
              <select
                id="logistic_type"
                value={logistics}
                onChange={(e) => setLogistics(e.target.value)}
                className="
                  w-full rounded-lg p-2
                  bg-[var(--input)] text-gray-400
                  focus:outline-none
                "
              >
                <option value="" disabled>
                  Logística
                </option>
                <option value="full">Full</option>
                <option value="flex_and_places">Flex e Places</option>
                <option value="collects">Coletas</option>
                <option value="flex">Flex</option>
                <option value="own_logistics">Própria Logística</option>
              </select>
              {logistics && (
                <p className="mt-2 text-white text-sm">
                  Custo da logística: {fmt(logisticsCosts[logistics])}
                </p>
              )}
            </div>
            <hr className="border-gray-600" />

            <div>
              <select
                id="ad_type"
                value={adType}
                onChange={(e) => setAdType(e.target.value)}
                className="
                  w-full rounded-lg p-2
                  bg-[var(--input)] text-gray-400
                  focus:outline-none
                "
              >
                <option value="" disabled>
                  Tipo de anúncio
                </option>
                <option value="classic">Clássico</option>
                <option value="premium">Premium</option>
                <option value="free">Free</option>
              </select>
              {adType && (
                <p className="mt-2 text-white text-sm">
                  Custo do anúncio: {fmt(adCosts[adType])}
                </p>
              )}
            </div>
            <hr className="border-gray-600" />

            {/* Buy Price e Aliquota */}
            <div>
              <label htmlFor="buy_price" className="block text-white">
                Custo de compra:
              </label>
              <input
                id="buy_price"
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="12,5"
                className="
                  w-full rounded-lg p-2
                  bg-input text-white placeholder:text-gray-400
                  focus:outline-none
                "
              />
            </div>
            <div>
              <label htmlFor="aliquot" className="block text-white">
                Alíquota:
              </label>
              <select
                id="aliquot"
                value={aliquot}
                onChange={(e) => setAliquot(e.target.value)}
                className="
                  w-full rounded-lg p-2
                  bg-input text-gray-400
                  focus:outline-none
                "
              >
                <option value="0.04">4%</option>
                <option value="0.073">7,3%</option>
                <option value="0.095">9,5%</option>
                <option value="0.107">10,7%</option>
                <option value="0.143">14,3%</option>
                <option value="0.19">19%</option>
              </select>
            </div>

            {/* Resultado */}
            {calcResult !== null && (
              <p id="calc-result" className="mt-4 text-white font-medium">
                Lucro Total: {fmt(calcResult)}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
