

type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    
  return (
    <div>
    <h4 className="text-md font-semibold mb-2"> Max Price</h4>
    <select
      className="p-2 border rounded-md w-full"
      value={selectedPrice}
      onChange={(event) =>
        onChange(
          event.target.value ? parseInt(event.target.value) : undefined
        )
      }
    >
      <option value="">Select Max Price</option>
      {[2000, 3000, 5000, 7000, 10000].map((price,i) => (
        <option value={price} key={i}>{price}</option>
      ))}
    </select>
  </div>
  )
}

export default PriceFilter