"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { formatBRL, parseToNumberFromMaskedBRL } from "@/helpers/currency";
import Image from "next/image";
import TooltipInfo from "@/components/TooltipInfo";

export interface MiniCalculatorProps {
  onCalc?: (sellPrice: number, calcResult: number | null) => void;
}

const logisticsCosts: Record<string, number> = {
  prime: 7,
  normal: 5,
  flex: 3,
  full: 10,
  express: 8,
};

const adCosts: Record<string, number> = {
  classic: 7,
  premium: 15,
  free: 0,
};

const parseBRL = (value: string) =>
  parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;

const maskNumber = (value: string, decimals: number) => {
  const digits = value.replace(/\D/g, "");
  if (!digits || Number(digits) === 0) return "";
  const pad = digits.padStart(decimals + 1, "0");
  const intPart = pad.slice(0, -decimals).replace(/^0+(?=\d)/, "");
  const decPart = pad.slice(-decimals);
  return `${intPart}.${decPart}`;
};

const parseNumber = (value: string) => parseFloat(value.replace(",", ".")) || 0;

export default function MiniCalculator({
  onCalc,
}: Readonly<MiniCalculatorProps>) {
  const [open, setOpen] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [aliquot, setAliquot] = useState("");
  const [logistics, setLogistics] = useState("");
  const [adType, setAdType] = useState<keyof typeof adCosts>("");
  const [customLogisticsEnabled, setCustomLogisticsEnabled] = useState(false);
  const [customLogisticsValue, setCustomLogisticsValue] = useState("");
  const [customAdEnabled, setCustomAdEnabled] = useState(false);
  const [customAdValue, setCustomAdValue] = useState("");
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [additionalCost, setAdditionalCost] = useState("");

  const handleSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const sellPrice = parseToNumberFromMaskedBRL(e.target.value);
    setSellPrice(formatBRL(sellPrice));
  };

  const handleBuyPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const buyPrice = parseToNumberFromMaskedBRL(e.target.value);
    setBuyPrice(formatBRL(buyPrice));
  };

  const handleCustomLogistics = (e: ChangeEvent<HTMLInputElement>) => {
    const logisticsCost = parseToNumberFromMaskedBRL(e.target.value);
    setCustomLogisticsValue(formatBRL(logisticsCost));
  };

  const handleAdditionalCost = (e: ChangeEvent<HTMLInputElement>) => {
    const additionalCost = parseToNumberFromMaskedBRL(e.target.value);
    setAdditionalCost(formatBRL(additionalCost));
  };

  const handleCustomAd = (e: ChangeEvent<HTMLInputElement>) =>
    setCustomAdValue(maskNumber(e.target.value, 2));

  const handleAliquot = (e: ChangeEvent<HTMLInputElement>) =>
    setAliquot(maskNumber(e.target.value, 2));

  useEffect(() => {
    // Se qualquer um dos preços principais estiver vazio, zera o resultado
    if (!sellPrice || !buyPrice) {
      setCalcResult(null);
      onCalc?.(0, null);
      return;
    }
    // >>> Converta SEMPRE com parseToNumberFromMaskedBRL <<<
    const sp = parseToNumberFromMaskedBRL(sellPrice); // "R$ 5,22" -> 5.22
    const bp = parseToNumberFromMaskedBRL(buyPrice); // "R$ 5,22" -> 5.22
    const additional = parseToNumberFromMaskedBRL(additionalCost);

    const logCost = customLogisticsEnabled
      ? parseToNumberFromMaskedBRL(customLogisticsValue) // "R$ 7,00" -> 7
      : logisticsCosts[logistics] ?? 0; // tabela (número já)

    const adPct = customAdEnabled
      ? (parseFloat(customAdValue.replace(",", ".")) || 0) / 100
      : (adCosts[adType] ?? 0) / 100;

    const alPct = (parseFloat(aliquot.replace(",", ".")) || 0) / 100;

    const result = sp - logCost - sp * adPct - bp - sp * alPct - additional;

    const final = Number.isFinite(result) ? result : null;
    setCalcResult(final);
    onCalc?.(sp, final);
  }, [
    sellPrice,
    buyPrice,
    logistics,
    customLogisticsEnabled,
    customLogisticsValue,
    adType,
    customAdEnabled,
    customAdValue,
    additionalCost,
    aliquot,
    onCalc,
  ]);

  const fmtBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-3 bottom-3 bg-[var(--black-to-primary)] h-20 text-white border border-white rounded-[20px] px-6 py-1 z-30 transform hover:scale-105 duration-200"
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
        <div className="fixed bottom-1 right-1 w-[310px] bg-[var(--black-to-primary)] border border-white rounded-lg p-5 z-[1000]">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-3 text-white text-lg"
          >
            ✕
          </button>
          <h2 className="text-white font-semibold text-lg text-center mt-2">
            Calculadora
          </h2>

          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="sell_price"
                className="block text-base text-white"
              >
                Valor de venda
                <TooltipInfo text="Valor pelo qual você deseja vender o produto." />
              </label>
              <input
                id="sell_price"
                type="text"
                value={sellPrice}
                onChange={handleSellPrice}
                placeholder="R$ 0,00"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-white text-base">
                  Custo de logística
                  <TooltipInfo text="Selecione ou insira um valor personalizado." />
                </label>
                <button
                  type="button"
                  className="text-xs text-white"
                  onClick={() => setCustomLogisticsEnabled((p) => !p)}
                >
                  {customLogisticsEnabled ? "Usar lista" : "Inserir valor"}
                </button>
              </div>
              {customLogisticsEnabled ? (
                <input
                  type="text"
                  value={customLogisticsValue}
                  onChange={handleCustomLogistics}
                  placeholder="R$ 0,00"
                  className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
                />
              ) : (
                <>
                  <select
                    value={logistics}
                    onChange={(e) => setLogistics(e.target.value)}
                    className="w-full text-base rounded-lg p-2 bg-[var(--black-to-primary)] text-white focus:outline-none"
                  >
                    <option value="" disabled>
                      Logística
                    </option>
                    {Object.keys(logisticsCosts).map((k) => (
                      <option key={k} value={k}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </option>
                    ))}
                  </select>
                  {logistics && (
                    <p className="mt-2 text-white text-sm">
                      Valor: {fmtBRL(logisticsCosts[logistics])}
                    </p>
                  )}
                </>
              )}
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="adPercentage" className="text-base text-white">
                  Taxa de anúncio (%)
                  <TooltipInfo text="Selecione ou insira uma taxa personalizada (%)." />
                </label>
                <button
                  type="button"
                  className="text-xs text-white"
                  onClick={() => setCustomAdEnabled((p) => !p)}
                >
                  {customAdEnabled ? "Usar lista" : "Inserir valor"}
                </button>
              </div>
              {customAdEnabled ? (
                <input
                  id="adPercentage"
                  type="text"
                  value={customAdValue}
                  onChange={handleCustomAd}
                  placeholder="0.00%"
                  className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
                />
              ) : (
                <>
                  <select
                    value={adType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setAdType(e.target.value)
                    }
                    className="w-full text-base rounded-lg p-2 bg-[var(--black-to-primary)] text-white focus:outline-none"
                  >
                    <option value="" disabled>
                      Anúncio
                    </option>
                    {Object.keys(adCosts).map((k) => (
                      <option key={k} value={k}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </option>
                    ))}
                  </select>
                  {adType && (
                    <p className="mt-2 text-white text-sm">
                      Taxa: {adCosts[adType].toFixed(2)}%
                    </p>
                  )}
                </>
              )}
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            <div>
              <label htmlFor="buy_price" className="block text-base text-white">
                Custo de compra
                <TooltipInfo text="Custo de compra do produto." />
              </label>
              <input
                id="buy_price"
                type="text"
                value={buyPrice}
                onChange={handleBuyPrice}
                placeholder="R$ 0,00"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            <div>
              <label
                htmlFor="additional_cost"
                className="block text-base text-white"
              >
                Custos adicionais
                <TooltipInfo text="Outros custos que afetem o preço final." />
              </label>
              <input
                id="additional_cost"
                type="text"
                value={additionalCost}
                onChange={handleAdditionalCost}
                placeholder="R$ 0,00"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            <div>
              <label htmlFor="aliquot" className="block text-base text-white">
                Alíquota (%)
                <TooltipInfo text="ICMS da venda do produto." />
              </label>
              <input
                id="aliquot"
                type="text"
                value={aliquot}
                onChange={handleAliquot}
                placeholder="0.00%"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            {calcResult !== null && (
              <p className="mt-4 text-white text-center font-medium">
                {calcResult >= 0 ? "Lucro Total:" : "Prejuízo Total:"}{" "}
                <strong>{fmtBRL(calcResult)}</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
