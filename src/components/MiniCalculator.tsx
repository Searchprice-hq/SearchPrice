"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface MiniCalculatorProps {
  onCalc?: (sellPrice: number, calcResult: number) => void;
}

const logisticsCosts: Record<string, number> = {
  prime: 10,
  normal: 15,
  flex: 5,
  full: 20,
  express: 8,
};

const adCosts: Record<string, number> = {
  classic: 5,
  premium: 12,
  free: 0,
};

export default function MiniCalculator({ onCalc }: MiniCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [aliquot, setAliquot] = useState("");
  const [logistics, setLogistics] = useState("");
  const [adType, setAdType] = useState("");
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [customLogisticsEnabled, setCustomLogisticsEnabled] = useState(false);
  const [customAdEnabled, setCustomAdEnabled] = useState(false);
  const [customLogisticsValue, setCustomLogisticsValue] = useState("");
  const [customAdValue, setCustomAdValue] = useState("");
  const [customAliquotEnabled, setCustomAliquotEnabled] = useState(false);
  const [customAliquotValue, setCustomAliquotValue] = useState("");

  useEffect(() => {
    if (!sellPrice || !buyPrice || !aliquot) {
      setCalcResult(null);
      if (onCalc) onCalc(Number(sellPrice) || 0, NaN);
      return;
    }

    const sp = parseFloat(sellPrice);
    const bp = parseFloat(buyPrice);
    const al = parseFloat(aliquot || "0");

    const logCost = customLogisticsEnabled
      ? parseFloat(customLogisticsValue || "0")
      : logisticsCosts[logistics] ?? 0;

    const adCost = customAdEnabled
      ? parseFloat(customAdValue || "0")
      : adCosts[adType] ?? 0;

    const result = sp - logCost - adCost - bp - sp * al;
    setCalcResult(result);
    if (onCalc) onCalc(sp, result);
  }, [
    sellPrice,
    buyPrice,
    logistics,
    adType,
    aliquot,
    onCalc,
    customLogisticsEnabled,
    customLogisticsValue,
    customAdEnabled,
    customAdValue,
  ]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed right-4 bottom-4 
            bg-[var(--black-to-primary)] h-20 text-white border border-white
            rounded-[20px] px-6 py-1 z-30
            transform transition-transform hover:scale-105 duration-200
          "
        >
          <Image
            src="/calculator.png"
            alt="Calculadora"
            width={45}
            height={45}
          />
        </button>
      )}

      {open && (
        <div
          className="
            fixed bottom-5 right-5 w-[250px] sm:w-[300px] 
            bg-[var(--black-to-primary)] border border-white
            rounded-lg p-5 z-[1000]
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
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="R$ 0,00"
                className="
                  w-full rounded-lg p-2
                  bg-[var(--black-to-primary)] text-white placeholder:text-gray-400
                  focus:outline-none
                "
              />
            </div>
            <hr className="border-[var(--gray-to-white)]" />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-white">Custo de logística</label>
                <button
                  type="button"
                  className="text-xs text-white"
                  onClick={() =>
                    setCustomLogisticsEnabled(!customLogisticsEnabled)
                  }
                >
                  {customLogisticsEnabled ? "Usar lista" : "Inserir valor"}
                </button>
              </div>

              {customLogisticsEnabled ? (
                <input
                  type="number"
                  value={customLogisticsValue}
                  onChange={(e) => setCustomLogisticsValue(e.target.value)}
                  placeholder="Valor customizado"
                  className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
                />
              ) : (
                <>
                  <select
                    value={logistics}
                    onChange={(e) => setLogistics(e.target.value)}
                    className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white focus:outline-none"
                  >
                    <option value="" disabled>
                      Logística
                    </option>
                    <option value="prime">Prime</option>
                    <option value="normal">Normal</option>
                    <option value="flex">Flex</option>
                    <option value="full">Full</option>
                    <option value="express">Express</option>
                  </select>
                  {logistics && (
                    <p className="mt-2 text-white text-sm">
                      Valor: {fmt(logisticsCosts[logistics])}
                    </p>
                  )}
                </>
              )}
            </div>
            <hr className="border-[var(--gray-to-white)]" />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-white">Tipo de anúncio</label>
                <button
                  type="button"
                  className="text-xs text-white"
                  onClick={() => setCustomAdEnabled(!customAdEnabled)}
                >
                  {customAdEnabled ? "Usar lista" : "Inserir valor"}
                </button>
              </div>

              {customAdEnabled ? (
                <input
                  type="number"
                  value={customAdValue}
                  onChange={(e) => setCustomAdValue(e.target.value)}
                  placeholder="Valor customizado"
                  className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
                />
              ) : (
                <>
                  <select
                    value={adType}
                    onChange={(e) => setAdType(e.target.value)}
                    className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white focus:outline-none"
                  >
                    <option value="" disabled>
                      Anúncio
                    </option>
                    <option value="classic">Clássico</option>
                    <option value="premium">Premium</option>
                    <option value="free">Free</option>
                  </select>
                  {adType && (
                    <p className="mt-2 text-white text-sm">
                      Valor: {fmt(adCosts[adType])}
                    </p>
                  )}
                </>
              )}
            </div>
            <hr className="border-[var(--gray-to-white)]" />

            <div>
              <label htmlFor="buy_price" className="block text-white">
                Custo de compra:
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="R$ 0,00"
                className="
                  w-full rounded-lg p-2
                  bg-[var(--black-to-primary)] text-white placeholder:text-gray-400
                  focus:outline-none
                "
              />
            </div>
            <hr className="border-[var(--gray-to-white)]" />

            <div>
              <label htmlFor="aliquot" className="block text-white">
                Alíquota (%):
              </label>
              <input
                type="number"
                step="0.001"
                value={aliquot}
                onChange={(e) => setAliquot(e.target.value)}
                placeholder="Ex: 0.073"
                className="
      w-full rounded-lg p-2
      bg-[var(--black-to-primary)] text-white placeholder:text-gray-400
      focus:outline-none
    "
              />
            </div>

            {calcResult !== null && (
              <p id="calc-result" className="mt-4 text-white font-medium">
                {calcResult >= 0 ? "Lucro Total:" : "Prejuízo Total:"}{" "}
                {fmt(calcResult)}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
