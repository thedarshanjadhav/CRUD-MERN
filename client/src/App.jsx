
// import react 
import { useState, useEffect } from 'react';

// import react redux
import { useDispatch, useSelector } from 'react-redux';

// import slice
import { addEmployee, fetchEmployees, updateEmployee, deleteEmployee } from './redux-toolkit/employeeSlice.js';

function App() {
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employees.employees);
  const [formData, setFormData] = useState({
    empname: '',
    empaddress: '',
    empphone: '',
    empemail: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateEmployee({id: editId, data: formData }));
      setEditMode(false); 
      clearForm();
      window.location.reload();
    } else {
      dispatch(addEmployee(formData));
    }
    clearForm();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (id) => {
    console.log("Editing employee with id:", id);
    const employeeToEdit = employees.find(emp => emp._id === id);
    console.log("Employee to edit:", employeeToEdit);
    if (employeeToEdit) {
      setFormData(employeeToEdit);
      setEditId(employeeToEdit._id);
      setEditMode(true);
    } else {
      console.error("Employee not found with id:", id);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    window.location.reload();
  };

  const clearForm = () => {
    setFormData({
      empname: '',
      empaddress: '',
      empphone: '',
      empemail: ''
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="empname">Emp Name</label>
          <input type="text" id="empname" name="empname" value={formData.empname} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="empaddress">Emp Address</label>
          <input type="textarea" id="empaddress" name="empaddress" value={formData.empaddress} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="empphone">Emp phone</label>
          <input type="text" id="empphone" name="empphone" value={formData.empphone} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="empemail">Emp email</label>
          <input type="text" id="empemail" name="empemail" value={formData.empemail} onChange={handleChange} />
        </div>
        <button type="submit">{editMode ? 'Update' : 'Submit'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Emp Name</th>
            <th>Emp Address</th>
            <th>Emp Phone</th>
            <th>Emp Email</th>
            <th>Action</th>
          </tr>
        </thead>
        {employees && employees.length > 0 ? (
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
              <td>{employee.empname}</td>
              <td>{employee.empaddress}</td>
              <td>{employee.empphone}</td>
              <td>{employee.empemail}</td>
              <td>
                <button onClick={() => handleEdit(employee._id)}>Edit</button>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        ) : (
          <tbody>
          <tr>
              <td colSpan="5">No employees found</td>
          </tr>
      </tbody>
  )}
      </table>
    </> 
  );
}

export default App;
