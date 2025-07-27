"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import TooltipInfo from "@/components/TooltipInfo";

export interface MiniCalculatorProps {
  // Agora o segundo parâmetro pode ser null
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

// --- Máscaras e Parsers ---

const maskBRL = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits || Number(digits) === 0) return "";
  const pad = digits.padStart(3, "0");
  const intPart = pad.slice(0, -2).replace(/^0+(?=\d)/, "");
  const decPart = pad.slice(-2);
  return `${intPart},${decPart}`;
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

export default function MiniCalculator({ onCalc }: MiniCalculatorProps) {
  // — estados inalterados —
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

  // — handlers aplicando máscara —
  const handleSellPrice = (e: ChangeEvent<HTMLInputElement>) =>
    setSellPrice(maskBRL(e.target.value));
  const handleBuyPrice = (e: ChangeEvent<HTMLInputElement>) =>
    setBuyPrice(maskBRL(e.target.value));
  const handleCustomLogistics = (e: ChangeEvent<HTMLInputElement>) =>
    setCustomLogisticsValue(maskBRL(e.target.value));
  const handleAdditionalCost = (e: ChangeEvent<HTMLInputElement>) =>
    setAdditionalCost(maskBRL(e.target.value));
  const handleCustomAd = (e: ChangeEvent<HTMLInputElement>) =>
    setCustomAdValue(maskNumber(e.target.value, 2));
  const handleAliquot = (e: ChangeEvent<HTMLInputElement>) =>
    setAliquot(maskNumber(e.target.value, 3));

  // — cálculo do resultado, com reset para null e callback zerado —
  useEffect(() => {
    // se não tiver valor de venda OU custo de compra, zera tudo
    if (!sellPrice || !buyPrice) {
      setCalcResult(null);
      if (onCalc) onCalc(0, null);
      return;
    }

    const sp = parseBRL(sellPrice);
    const bp = parseBRL(buyPrice);
    const logCost = customLogisticsEnabled
      ? parseBRL(customLogisticsValue)
      : logisticsCosts[logistics] ?? 0;
    const adPct = customAdEnabled
      ? parseNumber(customAdValue) / 100
      : (adCosts[adType] ?? 0) / 100;
    const additional = parseBRL(additionalCost);
    const alPct = parseNumber(aliquot) / 100;

    const result = sp - logCost - sp * adPct - bp - sp * alPct - additional;

    setCalcResult(isNaN(result) ? null : result);
    if (onCalc) onCalc(sp, isNaN(result) ? null : result);
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
          className="fixed right-4 bottom-4 bg-[var(--black-to-primary)] h-20 text-white border border-white rounded-[20px] px-6 py-1 z-30 transform hover:scale-105 duration-200"
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
        <div className="fixed bottom-5 right-5 w-[280px] sm:w-[300px] bg-[var(--black-to-primary)] border border-white rounded-lg p-5 z-[1000]">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-3 text-white text-lg"
          >
            ✕
          </button>
          <h2 className="text-white font-semibold text-lg text-center mt-4">
            Calculadora
          </h2>

          <div className="space-y-4 mt-4">
            {/* Valor de venda */}
            <div>
              <label htmlFor="sell_price" className="block text-white">
                Valor de venda
                <TooltipInfo text="Valor pelo qual você deseja vender o produto." />
              </label>
              <input
                id="sell_price"
                type="text"
                value={sellPrice}
                onChange={handleSellPrice}
                placeholder="0,00"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            {/* Custo de logística */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-white">
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
                  placeholder="0,00"
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

            {/* Taxa de anúncio */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="adPercentage" className="text-white">
                  Taxa de anúncio
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
                  placeholder="0.00"
                  className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
                />
              ) : (
                <>
                  <select
                    value={adType}
                    onChange={(e) => setAdType(e.target.value as any)}
                    className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white focus:outline-none"
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

            {/* Custo de compra */}
            <div>
              <label htmlFor="buy_price" className="block text-white">
                Custo de compra
                <TooltipInfo text="Custo de compra do produto." />
              </label>
              <input
                id="buy_price"
                type="text"
                value={buyPrice}
                onChange={handleBuyPrice}
                placeholder="0,00"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            {/* Custos adicionais */}
            <div>
              <label htmlFor="additional_cost" className="block text-white">
                Custos adicionais
                <TooltipInfo text="Outros custos que afetem o preço final." />
              </label>
              <input
                id="additional_cost"
                type="text"
                value={additionalCost}
                onChange={handleAdditionalCost}
                placeholder="0,00"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <hr className="border-[var(--gray-to-white)] -mt-2 mb-2" />

            {/* Alíquota */}
            <div>
              <label htmlFor="aliquot" className="block text-white">
                Alíquota (%)
                <TooltipInfo text="ICMS da venda do produto." />
              </label>
              <input
                id="aliquot"
                type="text"
                value={aliquot}
                onChange={handleAliquot}
                placeholder="0.000"
                className="w-full rounded-lg p-2 bg-[var(--black-to-primary)] text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            {/* Resultado só aparece após preencher venda + compra */}
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
