import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Button from "../../components/Button";
import apiRequest from "../../services/api";

const AdminUsersPage = () => {
  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    role,
    setRole,
  ] = useState("customer");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    updatingStatusId,
    setUpdatingStatusId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const editFormRef =
    useRef(null);

  // LOAD USERS
  const fetchUsers =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiRequest(
            "/users"
          );

        setUsers(
          Array.isArray(data)
            ? data
            : Array.isArray(
                  data?.data
                )
              ? data.data
              : []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  // EDIT USER
  const handleEdit =
    (user) => {
      setEditingId(
        user._id
      );

      setName(
        user.name || ""
      );

      setEmail(
        user.email || ""
      );

      setRole(
        user.role ||
          "customer"
      );

      setError("");
      setSuccess("");

      requestAnimationFrame(() => {
        editFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        const nameInput =
          document.getElementById(
            `user-name-${user._id}`
          );

        nameInput?.focus();
      });
    };

  // CANCEL EDIT
  const cancelEdit =
    () => {
      setEditingId(null);
      setName("");
      setEmail("");
      setRole("customer");
    };

  // SAVE USER
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!editingId) {
        return;
      }

      if (
        !name.trim()
      ) {
        setError(
          "Name is required."
        );

        return;
      }

      if (
        !email.trim()
      ) {
        setError(
          "Email is required."
        );

        return;
      }

      try {
        setSaving(true);

        const data =
          await apiRequest(
            `/users/${editingId}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  name:
                    name.trim(),

                  email:
                    email.trim(),

                  role,
                }),
            }
          );

        setUsers(
          (previous) =>
            previous.map(
              (user) =>
                user._id ===
                editingId
                  ? data.user
                  : user
            )
        );

        setSuccess(
          data.message ||
            "User updated successfully."
        );

        cancelEdit();
      } catch (err) {
        setError(
          err.message ||
            "Unable to update user."
        );
      } finally {
        setSaving(false);
      }
    };

  // ACTIVE / INACTIVE
  const handleStatusToggle =
    async (user) => {
      const newStatus =
        !user.isActive;

      const action =
        newStatus
          ? "activate"
          : "deactivate";

      const confirmed =
        window.confirm(
          `Are you sure you want to ${action} ${user.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setUpdatingStatusId(
          user._id
        );

        setError("");
        setSuccess("");

        const data =
          await apiRequest(
            `/users/${user._id}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  isActive:
                    newStatus,
                }),
            }
          );

        setUsers(
          (previous) =>
            previous.map(
              (
                currentUser
              ) =>
                currentUser._id ===
                user._id
                  ? data.user
                  : currentUser
            )
        );

        setSuccess(
          newStatus
            ? "User activated successfully."
            : "User deactivated successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to update user status."
        );
      } finally {
        setUpdatingStatusId(
          null
        );
      }
    };

  // FILTER USERS
  const filteredUsers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return users;
      }

      return users.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(
              keyword
            ) ||
          user.email
            ?.toLowerCase()
            .includes(
              keyword
            ) ||
          user.role
            ?.toLowerCase()
            .includes(
              keyword
            )
      );
    }, [
      users,
      search,
    ]);

  // USER COUNTS
  const activeCount =
    users.filter(
      (user) =>
        user.isActive
    ).length;

  const inactiveCount =
    users.filter(
      (user) =>
        !user.isActive
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role ===
        "admin"
    ).length;

  const customerCount =
    users.filter(
      (user) =>
        user.role ===
        "customer"
    ).length;

  // LOADING
  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 px-4 py-16 sm:px-6 lg:px-8">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-7xl rounded-3xl border-2 border-blue-200 bg-white p-10 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-950"
          />

          <h1 className="mt-5 text-xl font-black text-blue-950">
            Loading user management
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving registered
            BulldogEx user accounts.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      aria-labelledby="admin-users-title"
      className="min-h-screen bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              BulldogEx Administration
            </p>

            <h1
              id="admin-users-title"
              className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
            >
              User Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
              View registered users,
              edit account information,
              manage roles, and control
              account access.
            </p>
          </div>

          <Button
            to="/admin"
            variant="secondary"
          >
            ← Dashboard
          </Button>
        </header>

        {/* MESSAGES */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5"
          >
            <p className="font-black text-red-950">
              User management error
            </p>

            <p className="mt-1 text-sm leading-6 text-red-900">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border-2 border-green-300 bg-green-50 p-5"
          >
            <p className="font-black text-green-950">
              Success
            </p>

            <p className="mt-1 text-sm leading-6 text-green-900">
              {success}
            </p>
          </div>
        )}

        {/* ACCOUNT SUMMARY */}
        <section
          aria-labelledby="user-summary-title"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Overview
              </p>

              <h2
                id="user-summary-title"
                className="mt-1 text-2xl font-black text-blue-950"
              >
                Account Summary
              </h2>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={
                fetchUsers
              }
            >
              Refresh Users
            </Button>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border-2 border-green-300 bg-green-50 p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-green-900">
                Active Users
              </dt>

              <dd className="mt-2 text-4xl font-black text-green-950">
                {
                  activeCount
                }
              </dd>
            </div>

            <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-red-900">
                Inactive Users
              </dt>

              <dd className="mt-2 text-4xl font-black text-red-950">
                {
                  inactiveCount
                }
              </dd>
            </div>

            <div className="rounded-3xl border-2 border-blue-300 bg-blue-50 p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-blue-900">
                Admin Accounts
              </dt>

              <dd className="mt-2 text-4xl font-black text-blue-950">
                {
                  adminCount
                }
              </dd>
            </div>

            <div className="rounded-3xl border-2 border-yellow-300 bg-yellow-50 p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-yellow-900">
                Customer Accounts
              </dt>

              <dd className="mt-2 text-4xl font-black text-yellow-950">
                {
                  customerCount
                }
              </dd>
            </div>
          </dl>
        </section>

        {/* USERS HEADER */}
        <section
          aria-labelledby="registered-users-title"
          className="mt-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Accounts
              </p>

              <h2
                id="registered-users-title"
                className="mt-1 text-2xl font-black text-blue-950"
              >
                Registered Users
              </h2>

              <p className="mt-2 text-sm text-zinc-700">
                Showing{" "}
                <strong>
                  {
                    filteredUsers.length
                  }
                </strong>{" "}
                of{" "}
                <strong>
                  {
                    users.length
                  }
                </strong>{" "}
                users.
              </p>
            </div>

            {/* SEARCH */}
            <div className="w-full sm:max-w-sm">
              <label
                htmlFor="admin-user-search"
                className="block text-sm font-bold text-zinc-950"
              >
                Search users
              </label>

              <input
                id="admin-user-search"
                type="search"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Name, email, or role..."
                className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200"
              />
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            className="mt-3 min-h-5 text-sm font-semibold text-zinc-700"
          >
            {search
              ? `${filteredUsers.length} user result${
                  filteredUsers.length ===
                  1
                    ? ""
                    : "s"
                } found.`
              : `${users.length} registered user${
                  users.length ===
                  1
                    ? ""
                    : "s"
                }.`}
          </div>

          {/* EMPTY */}
          {filteredUsers.length ===
          0 ? (
            <div className="mt-5 rounded-3xl border-2 border-dashed border-zinc-300 bg-white p-10 text-center">
              <div
                aria-hidden="true"
                className="text-4xl"
              >
                👥
              </div>

              <h3 className="mt-4 text-xl font-black text-blue-950">
                No users found
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                No accounts match your
                current search.
              </p>

              {search && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-5"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <ul
              aria-label="Registered user management list"
              className="mt-5 space-y-5"
            >
              {filteredUsers.map(
                (user) => (
                  <li
                    key={
                      user._id
                    }
                  >
                    <article className="rounded-3xl border-2 border-blue-100 bg-white p-5 shadow-sm sm:p-6">

                      {/* EDIT MODE */}
                      {editingId ===
                      user._id ? (
                        <form
                          ref={
                            editFormRef
                          }
                          onSubmit={
                            handleSubmit
                          }
                          aria-labelledby={`edit-user-${user._id}`}
                        >
                          <div className="border-b-2 border-zinc-200 pb-5">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                              Edit Account
                            </p>

                            <h3
                              id={`edit-user-${user._id}`}
                              className="mt-1 text-xl font-black text-blue-950"
                            >
                              Edit User
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-700">
                              Update this user's
                              profile information
                              or account role.
                            </p>
                          </div>

                          <div className="mt-5 grid gap-5 lg:grid-cols-3">

                            {/* NAME */}
                            <div>
                              <label
                                htmlFor={`user-name-${user._id}`}
                                className="block text-sm font-bold text-zinc-950"
                              >
                                Full Name
                                <span
                                  aria-hidden="true"
                                  className="ml-1 text-red-600"
                                >
                                  *
                                </span>
                              </label>

                              <input
                                id={`user-name-${user._id}`}
                                type="text"
                                value={
                                  name
                                }
                                disabled={
                                  saving
                                }
                                required
                                aria-required="true"
                                autoComplete="name"
                                onChange={(
                                  event
                                ) =>
                                  setName(
                                    event.target
                                      .value
                                  )
                                }
                                className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                              />
                            </div>

                            {/* EMAIL */}
                            <div>
                              <label
                                htmlFor={`user-email-${user._id}`}
                                className="block text-sm font-bold text-zinc-950"
                              >
                                Email Address
                                <span
                                  aria-hidden="true"
                                  className="ml-1 text-red-600"
                                >
                                  *
                                </span>
                              </label>

                              <input
                                id={`user-email-${user._id}`}
                                type="email"
                                value={
                                  email
                                }
                                disabled={
                                  saving
                                }
                                required
                                aria-required="true"
                                autoComplete="email"
                                onChange={(
                                  event
                                ) =>
                                  setEmail(
                                    event.target
                                      .value
                                  )
                                }
                                className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                              />
                            </div>

                            {/* ROLE */}
                            <div>
                              <label
                                htmlFor={`user-role-${user._id}`}
                                className="block text-sm font-bold text-zinc-950"
                              >
                                Role
                                <span
                                  aria-hidden="true"
                                  className="ml-1 text-red-600"
                                >
                                  *
                                </span>
                              </label>

                              <select
                                id={`user-role-${user._id}`}
                                value={
                                  role
                                }
                                disabled={
                                  saving
                                }
                                required
                                aria-required="true"
                                onChange={(
                                  event
                                ) =>
                                  setRole(
                                    event.target
                                      .value
                                  )
                                }
                                className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                              >
                                <option value="customer">
                                  Customer
                                </option>

                                <option value="admin">
                                  Administrator
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="submit"
                              variant="blue"
                              disabled={
                                saving
                              }
                              aria-busy={
                                saving
                              }
                              className="w-full sm:w-auto"
                            >
                              {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                            </Button>

                            <Button
                              type="button"
                              variant="secondary"
                              disabled={
                                saving
                              }
                              onClick={
                                cancelEdit
                              }
                              className="w-full sm:w-auto"
                            >
                              Cancel Editing
                            </Button>
                          </div>

                          <div
                            aria-live="polite"
                            className="mt-3 min-h-5 text-sm font-semibold text-blue-900"
                          >
                            {saving
                              ? "Updating user account information."
                              : ""}
                          </div>
                        </form>
                      ) : (
                        /* ========================= */
                        /* VIEW MODE */
                        /* ========================= */
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">

                            <div className="flex items-center gap-3">
                              <div
                                aria-hidden="true"
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-lg font-black text-blue-950"
                              >
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div className="min-w-0">
                                <h3 className="text-xl font-black text-blue-950">
                                  {
                                    user.name
                                  }
                                </h3>

                                <p className="mt-1 break-all text-sm text-zinc-700">
                                  {
                                    user.email
                                  }
                                </p>
                              </div>
                            </div>

                            <dl className="mt-4 flex flex-wrap gap-2">

                              <div>
                                <dt className="sr-only">
                                  Role
                                </dt>

                                <dd className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black capitalize text-blue-950">
                                  Role:{" "}
                                  {
                                    user.role
                                  }
                                </dd>
                              </div>

                              <div>
                                <dt className="sr-only">
                                  Account status
                                </dt>

                                <dd
                                  className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                                    user.isActive
                                      ? "border-green-300 bg-green-50 text-green-950"
                                      : "border-red-300 bg-red-50 text-red-950"
                                  }`}
                                >
                                  {user.isActive
                                    ? "● Active"
                                    : "○ Inactive"}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          {/* ACTIONS */}
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                handleEdit(
                                  user
                                )
                              }
                              disabled={
                                updatingStatusId ===
                                user._id
                              }
                              aria-label={`Edit ${user.name}`}
                              className="w-full sm:w-auto"
                            >
                              Edit User
                            </Button>

                            <Button
                              type="button"
                              variant={
                                user.isActive
                                  ? "danger"
                                  : "blue"
                              }
                              disabled={
                                updatingStatusId ===
                                user._id
                              }
                              aria-busy={
                                updatingStatusId ===
                                user._id
                              }
                              aria-label={
                                user.isActive
                                  ? `Deactivate ${user.name}`
                                  : `Activate ${user.name}`
                              }
                              onClick={() =>
                                handleStatusToggle(
                                  user
                                )
                              }
                              className="w-full sm:w-auto"
                            >
                              {updatingStatusId ===
                              user._id
                                ? "Updating..."
                                : user.isActive
                                  ? "Deactivate User"
                                  : "Activate User"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </article>
                  </li>
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminUsersPage;