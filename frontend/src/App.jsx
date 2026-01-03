import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner'

function App() {
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
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contacts`);
    const data = await res.json();
    toast.success('Contacts fetched successfully!')
    setContacts(data);
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

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      toast.error('Failed to add contact!')
      return;
    };

    toast.success('Contact added successfully!')

    const data = await res.json();

    setContacts((prev) => [data.contact, ...prev]);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const deleteContact = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contacts/${id}`,
      { method: "DELETE" }
    );
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
            className="w-full bg-green-300 hover:bg-green-400 py-2 rounded font-bold text-green-700 cursor-pointer"
          >
            Add Contact
          </button>
        </form>


        <div className="bg-neutral-800 p-6 rounded-md shadow-sm shadow-green-300">
          <h2 className="text-xl mb-3 text-green-300 font-semibold">Contact List</h2>


          <div className="overflow-x-auto">
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
          </div>


        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App
