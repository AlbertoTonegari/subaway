const Select = ({ ...props }) => {
  return (
    <select className="select w-full select-bordered mb-4" {...props}>
      <option selected>Monthly</option>
      <option>Yearly</option>
    </select>
  );
};

export default Select;
