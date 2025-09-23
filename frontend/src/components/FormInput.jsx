import '../css/FormInput.css';
export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  name
}) {
  return (
    <div className="form-input">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}          
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        required
      />
    </div>
  );
}
