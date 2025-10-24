interface AmountFormatterFunction {
  formattedAmount: (amount: string | number) => string;
}
const useAmountFormatter = (): AmountFormatterFunction => {
  const formattedAmount = (amount: string | number) => {
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  };

  return { formattedAmount };
};

export default useAmountFormatter;
