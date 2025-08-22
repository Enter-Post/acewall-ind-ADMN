import { axiosInstance } from "@/lib/AxiosInstance";
import { useState, useEffect } from "react";

const WithdrawalsTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [currentAction, setCurrentAction] = useState(null); // Action to be performed (approve/reject)
  const [currentWithdrawalId, setCurrentWithdrawalId] = useState(null); // Current withdrawal ID
  const [loadingAction, setLoadingAction] = useState(false); // Loading state for approve/reject

  // Fetch withdrawals on component mount
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await axiosInstance.get("teacher/admin/withdrawals");
        setWithdrawals(res.data.withdrawals);
        console.log(res.data.withdrawals, "withdrawals");
      } catch (err) {
        setError("Failed to fetch withdrawals");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // Handle updating Stripe ID (approve or reject)
  const handleUpdateStripeId = async (id, action) => {
    try {
      setLoadingAction(true); // Set loading state to true
      const res = await axiosInstance.put(`teacher/admin/withdrawals/${id}/update-stripe-id`, {
        stripeAccountId: action,
      });
      const updatedWithdrawal = res.data.withdrawal;

      // Update the withdrawal in the local state
      setWithdrawals((prevWithdrawals) =>
        prevWithdrawals.map((w) =>
          w._id === updatedWithdrawal._id ? updatedWithdrawal : w
        )
      );

    } catch (err) {
      setError("Failed to update Stripe Account ID");
    } finally {
      setLoadingAction(false); // Set loading state back to false
      setShowModal(false); // Close the modal
    }
  };

  // Show modal and set current action
  const showConfirmationModal = (id, action) => {
    setCurrentWithdrawalId(id);
    setCurrentAction(action);
    setShowModal(true);
  };

  if (loading) {
    return <p>Loading withdrawals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Withdrawals</h2>

      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Teacher Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Amount</th>
            <th className="border px-4 py-2 text-left">Method</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal._id}>
              <td className="border px-4 py-2">
                {withdrawal.teacher?.firstName + " " + withdrawal.teacher?.lastName || "N/A"}
              </td>
              <td className="border px-4 py-2">{withdrawal.teacher?.email || "N/A"}</td>
              <td className="border px-4 py-2">${withdrawal.amount}</td>
              <td className="border px-4 py-2">{withdrawal.method}</td>
              <td className="border px-4 py-2">
                {new Date(withdrawal.requestedAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {withdrawal.status === "pending" ? (
                  <>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded mr-2"
                      onClick={() => showConfirmationModal(withdrawal._id, "approved")}
                    >
                      {loadingAction && currentWithdrawalId === withdrawal._id ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded"
                      onClick={() => showConfirmationModal(withdrawal._id, "rejected")}
                    >
                      {loadingAction && currentWithdrawalId === withdrawal._id ? "Rejecting..." : "Reject"}
                    </button>
                  </>
                ) : (
                  <span>{withdrawal.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed flex justify-center items-center">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p>
              You are about to {currentAction} this withdrawal. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => handleUpdateStripeId(currentWithdrawalId, currentAction)}
              >
                {currentAction === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalsTable;
