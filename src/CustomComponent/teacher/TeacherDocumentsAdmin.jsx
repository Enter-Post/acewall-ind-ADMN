import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";

const statusClasses = {
  verified: "text-green-600 font-semibold",
  not_verified: "text-red-600 font-semibold",
  pending: "text-yellow-600 font-semibold",
};

const TeacherDocumentsAdmin = ({ teacherId, documents = {}, refetch }) => {
  const [loadingId, setLoadingId] = useState(null);

  // 🔄 Flatten grouped documents into a single array with category info
  const allDocuments = useMemo(() => {
    const flat = [];
    for (const category in documents) {
      const group = documents[category];
      if (Array.isArray(group)) {
        group.forEach((doc) =>
          flat.push({
            ...doc,
            category,
          })
        );
      }
    }
    return flat;
  }, [documents]);

  const updateDocumentStatus = async (docId, status) => {
    setLoadingId(docId);
    try {
      const res = await axiosInstance.patch(`/auth/verify-document/${teacherId}/${docId}`, {
        status,
      });

      toast.success(res.data.message || `Document ${status}`);
      if (typeof refetch === "function") refetch();
    } catch (err) {
      console.error("Failed to update document status:", err);
      toast.error("Failed to update document status.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Uploaded Documents</h2>
      {allDocuments.length > 0 ? (
        <ul className="space-y-4">
          {allDocuments.map((doc) => (
            <li
              key={doc._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{doc.name}</p>
                <p className="text-sm text-gray-600 capitalize">Category: {doc.category}</p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className={statusClasses[doc.verificationStatus]}>
                    {doc.verificationStatus}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  View
                </a>

                {doc.verificationStatus === "pending" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={loadingId === doc._id}
                      onClick={() => updateDocumentStatus(doc._id, "verified")}
                    >
                      {loadingId === doc._id ? "Verifying..." : "Approve"}
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={loadingId === doc._id}
                      onClick={() => updateDocumentStatus(doc._id, "not_verified")}
                    >
                      {loadingId === doc._id ? "Rejecting..." : "Reject"}
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No documents uploaded yet.</p>
      )}
    </div>
  );
};

export default TeacherDocumentsAdmin;
