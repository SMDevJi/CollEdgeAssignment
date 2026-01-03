import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner'
import { FaSpinner } from 'react-icons/fa';

function App() {
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);


  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contacts`);
    const data = await res.json();
    toast.success('Contacts fetched successfully!')
    setContacts(data);
    setLoading(false)
  };

  const validate = () => {
    const errs = {};
    if (!form.name) {
      errs.name = "Name is required";
    }

    if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
      errs.email = "Invalid email";
    }


    if (!form.phone) {
      errs.phone = "Phone number is required";
    } else if (form.phone.length < 10 || form.phone.length > 15) {
      errs.phone = "Phone number must be 10–15 digits"
    }

    setErrors(errs);
    const isValid = Object.keys(errs).length === 0;
    return isValid;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setAdding(true)

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      toast.error('Failed to add contact!')
      setAdding(false)
      return;
    };

    toast.success('Contact added successfully!')
    setAdding(false)

    const data = await res.json();

    setContacts((prev) => [data.contact, ...prev]);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const deleteContact = async (id) => {
    toast.warning(' Deleting contact.....')
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contacts/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      toast.error('Failed to delete contact!')
      return;
    };
    toast.success('Contact deleted successfully!')
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };



  return (
    <div className="min-h-screen bg-neutral-900 text-green-300 text-lg p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 ">
          Contact Management App
        </h1>


        <form
          onSubmit={handleSubmit}
          className=" bg-neutral-800 p-6 rounded-md shadow-green-300 shadow-sm mb-10 text-green-100"
        >
          <h2 className="text-xl mb-4 text-green-300 font-semibold">Add Contact</h2>



          <div key="name" className="mb-4">
            <input
              className="w-full bg-transparent border border-gray-600 focus:outline-none  focus:shadow-green-300 focus:shadow-sm rounded p-2"
              placeholder="Name"
              value={form["name"]}
              onChange={(e) =>
                setForm({ ...form, "name": e.target.value })
              }
            />
            {errors["name"] && (
              <p className="text-red-400 text-sm">{errors["name"]}</p>
            )}
          </div>


          <div key="email" className="mb-4">
            <input
              type='email'
              className="w-full bg-transparent border border-gray-600 focus:outline-none  focus:shadow-green-300 focus:shadow-sm rounded p-2"
              placeholder="Email"
              value={form["email"]}
              onChange={(e) =>
                setForm({ ...form, "email": e.target.value })
              }
            />
            {errors["email"] && (
              <p className="text-red-400 text-sm">{errors["email"]}</p>
            )}
          </div>



          <div key="phone" className="mb-4">
            <input

              className="w-full bg-transparent border border-gray-600 focus:outline-none  focus:shadow-green-300 focus:shadow-sm rounded p-2"
              placeholder="Phone number"


              value={form["phone"]}
              onChange={(e) =>
                setForm({ ...form, "phone": e.target.value.replace(/\D/g, "") })
              }
            />
            {errors["phone"] && (
              <p className="text-red-400 text-sm">{errors["phone"]}</p>
            )}
          </div>



          <textarea
            className="w-full bg-transparent border border-gray-600 focus:outline-none  focus:shadow-green-300 focus:shadow-sm  rounded p-2 mb-4"
            placeholder="Message (optional)"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button
            className={`w-full flex justify-center items-center ${adding ? 'bg-green-500 hover:bg-green-500 text-white ' : 'bg-green-300 hover:bg-green-400 text-green-700'}  py-2 px-3 rounded font-bold  cursor-pointer`}
          >
            {adding ? <FaSpinner className="animate-spin mr-2" /> : ''}
            {adding ? 'Adding Contact...' : 'Add Contact'}
          </button>
        </form>


        <div className="bg-neutral-800 p-6 rounded-md shadow-sm shadow-green-300">
          <h2 className="text-xl mb-3 text-green-300 font-semibold">Contact List</h2>


          <div className="overflow-x-auto ">
            {loading &&
              <div className="loading-container w-full h-20 flex justify-center">
                <FaSpinner className=" w-12.5 h-12.5 animate-spin" />
              </div>}
            {!loading &&
              <table className="w-full min-w-150 text-left">
                <thead className="border-b border-gray-300 text-white">
                  <tr>
                    <th className='p-2'>Name</th>
                    <th className='p-2'>Email</th>
                    <th className='p-2'>Phone</th>
                    <th className='p-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>


                  {contacts.map((c) => (
                    <tr key={c._id} className="border-b border-gray-800 text-xl">
                      <td className='p-2'>{c.name}</td>
                      <td className="text-green-300 p-2">{c.email}</td>
                      <td className='p-2'>{c.phone}</td>
                      <td className='p-2'>
                        <button
                          onClick={() => deleteContact(c._id)}
                          className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded-md text-lg font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }

          </div>


        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App
