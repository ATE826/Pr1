import '../css/FormInput.css';
export default function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div className="form-group">
      <label id='select-label' className="form-label">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input-field"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
