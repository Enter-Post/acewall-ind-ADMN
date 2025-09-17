import { axiosInstance } from "@/lib/AxiosInstance";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Layers } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card"; 
import BackButton from "@/CustomComponent/BackButton";

const WithdrawalsTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentWithdrawalId, setCurrentWithdrawalId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [withdrawalStats, setWithdrawalStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalWithdrawalsCount: 0,
  });

  // Fetch withdrawals
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await axiosInstance.get("teacher/admin/withdrawals", {
          params: { page, limit },
        });

        const { withdrawals, pagination, stats } = res.data;
        setWithdrawals(withdrawals || []);
        setPagination(pagination || { currentPage: 1, totalPages: 1, totalWithdrawalsCount: 0 });
        setWithdrawalStats(stats || { approved: 0, pending: 0, rejected: 0 });
      } catch (err) {
        setError("Failed to fetch withdrawals");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [page, limit]);

  // Approve / Reject
  const handleUpdateStripeId = async (id, action) => {
    try {
      setLoadingAction(true);
      const res = await axiosInstance.put(
        `teacher/admin/withdrawals/${id}/update-stripe-id`,
        {
          action, // "approved" or "rejected"
        }
      );

      const updatedWithdrawal = res.data.withdrawal;
      setWithdrawals((prev) =>
        prev.map((w) => (w._id === updatedWithdrawal._id ? updatedWithdrawal : w))
      );
    } catch (err) {
      setError("Failed to update withdrawal");
    } finally {
      setLoadingAction(false);
      setShowModal(false);
    }
  };

  // Show modal
  const showConfirmationModal = (id, action) => {
    setCurrentWithdrawalId(id);
    setCurrentAction(action);
    setShowModal(true);
  };

  // Page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading withdrawals...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        All Withdrawals
      </p>
      <BackButton className="mb-6" />

      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50">
            <CardContent>
              <div className="flex justify-between items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-lg font-semibold text-green-800">{withdrawalStats.approved}</p>
              </div>
              <p className="text-sm text-green-700">Approved Withdrawals</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardContent>
              <div className="flex justify-between items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <p className="text-lg font-semibold text-yellow-800">{withdrawalStats.pending}</p>
              </div>
              <p className="text-sm text-yellow-700">Pending Withdrawals</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardContent>
              <div className="flex justify-between items-center">
                <XCircle className="h-8 w-8 text-red-500" />
                <p className="text-lg font-semibold text-red-800">{withdrawalStats.rejected}</p>
              </div>
              <p className="text-sm text-red-700">Rejected Withdrawals</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardContent>
              <div className="flex justify-between items-center">
                <Layers className="h-8 w-8 text-gray-500" />
                <p className="text-lg font-semibold text-gray-800">
                  {pagination.totalWithdrawalsCount}
                </p>
              </div>
              <p className="text-sm text-gray-700">Total Withdrawals</p>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawals Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Teacher Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stripe ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {withdrawal.teacher?.firstName + " " + withdrawal.teacher?.lastName || "N/A"}
                  </td>
                  <td className="border px-4 py-2">{withdrawal.teacher?.email || "N/A"}</td>
                  <td className="border px-4 py-2">${withdrawal.amount}</td>
                  <td className="border px-4 py-2">{withdrawal.method}</td>
                  <td className="border px-4 py-2">
                    {withdrawal.stripeAccountId ? (
                      withdrawal.stripeAccountId
                    ) : (
                      <span className="text-gray-400 italic">Not Set</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(withdrawal.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    {withdrawal.status === "pending" ? (
                      <>
                        <Button
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          onClick={() => showConfirmationModal(withdrawal._id, "approved")}
                          disabled={loadingAction && currentWithdrawalId === withdrawal._id}
                        >
                          {loadingAction && currentWithdrawalId === withdrawal._id
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                        <Button
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          onClick={() => showConfirmationModal(withdrawal._id, "rejected")}
                          disabled={loadingAction && currentWithdrawalId === withdrawal._id}
                        >
                          {loadingAction && currentWithdrawalId === withdrawal._id
                            ? "Rejecting..."
                            : "Reject"}
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{withdrawal.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-md shadow-md hover:from-green-400 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-md shadow-md hover:from-green-400 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Next
          </button>
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-md max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Are you sure?</h3>
              <p className="text-sm text-gray-700">
                You are about to {currentAction} this withdrawal. This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className={`px-4 py-2 ${
                    currentAction === "approved"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  } rounded-md`}
                  onClick={() => handleUpdateStripeId(currentWithdrawalId, currentAction)}
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <>
                      <span className="animate-spin mr-2">🔄</span>
                      {currentAction === "approved" ? "Approving..." : "Rejecting..."}
                    </>
                  ) : currentAction === "approved" ? (
                    "Approve"
                  ) : (
                    "Reject"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WithdrawalsTable;
