import React, { useEffect, useState } from "react";
import {
    Calendar,
    PlusCircle,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const formatDate = (dateString) => dateString?.slice(0, 10); // ✅ helper for clean formatting

const Semester = () => {
    const [semesterModalOpen, setSemesterModalOpen] = useState(false);
    const [quarterModalOpen, setQuarterModalOpen] = useState(false);
    const [semesterData, setSemesterData] = useState({ title: "", startDate: "", endDate: "" });
    const [quarterData, setQuarterData] = useState({ title: "", startDate: "", endDate: "" });
    const [semesters, setSemesters] = useState([]);
    const [activeSemId, setActiveSemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [semesterErrors, setSemesterErrors] = useState({});
    const [quarterErrors, setQuarterErrors] = useState({});

    const fetchSemestersAndQuarters = async () => {
        setLoading(true);
        try {
            const [semRes, qtrRes] = await Promise.all([
                axiosInstance.get("/semester/get"),
                axiosInstance.get("/quarter/get"),
            ]);

            const semesterList = semRes.data.semesters;
            const quarterList = qtrRes.data.quarters;

            const combined = semesterList.map((sem) => ({
                ...sem,
                quarters: quarterList.filter((q) => q.semester === sem._id),
            }));

            setSemesters(combined);
        } catch (error) {
            console.error("Error loading semesters and quarters:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemestersAndQuarters();
    }, []);

    const validateSemester = () => {
        const errors = {};
        const lastSem = semesters[semesters.length - 1];
        if (!semesterData.title.trim()) errors.title = "Title is required";
        if (!semesterData.startDate) errors.startDate = "Start date is required";
        if (!semesterData.endDate) errors.endDate = "End date is required";

        if (semesterData.startDate && semesterData.endDate) {
            if (semesterData.startDate >= semesterData.endDate) {
                errors.date = "Start date must be before end date";
            }
            if (lastSem && semesterData.startDate <= lastSem.endDate) {
                errors.overlap = `New semester must start after ${formatDate(lastSem.endDate)}`;
            }
        }

        setSemesterErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateQuarter = () => {
        const errors = {};
        const currentSem = semesters.find((sem) => sem._id === activeSemId);
        const { startDate, endDate } = quarterData;

        if (!quarterData.title.trim()) errors.title = "Title is required";
        if (!startDate) errors.startDate = "Start date is required";
        if (!endDate) errors.endDate = "End date is required";

        if (startDate && endDate) {
            if (startDate >= endDate) {
                errors.date = "Start date must be before end date";
            }
            if (currentSem) {
                if (startDate < currentSem.startDate || endDate > currentSem.endDate) {
                    errors.range = `Quarter must be within semester (${formatDate(currentSem.startDate)} - ${formatDate(currentSem.endDate)})`;
                }

                for (let q of currentSem.quarters) {
                    if (
                        (startDate >= q.startDate && startDate < q.endDate) ||
                        (endDate > q.startDate && endDate <= q.endDate) ||
                        (startDate <= q.startDate && endDate >= q.endDate)
                    ) {
                        errors.overlap = `Quarter overlaps with "${q.title}" (${formatDate(q.startDate)} - ${formatDate(q.endDate)})`;
                        break;
                    }
                }
            }
        }

        setQuarterErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateSemester = async () => {
        if (!validateSemester()) return;

        try {
            await axiosInstance.post("/semester/create", semesterData);
            toast.success("Semester created successfully");
            setSemesterModalOpen(false);
            setSemesterData({ title: "", startDate: "", endDate: "" });
            setSemesterErrors({});
            fetchSemestersAndQuarters();
        } catch (error) {
            console.error("Error creating semester:", error);
            toast.error("Error creating semester");
        }
    };

    const handleCreateQuarter = async () => {
        if (!validateQuarter()) return;

        try {
            await axiosInstance.post("/quarter/create", {
                ...quarterData,
                semester: activeSemId,
            });
            toast.success("Quarter created successfully");
            setQuarterModalOpen(false);
            setQuarterData({ title: "", startDate: "", endDate: "" });
            setQuarterErrors({});
            fetchSemestersAndQuarters();
        } catch (error) {
            console.error("Error creating quarter:", error);
            toast.error("Error creating quarter");
        }
    };

    const handleOpenQuarterModal = (semId) => {
        setActiveSemId(semId);
        setQuarterModalOpen(true);
        setQuarterErrors({});
    };

    const lastSemester = semesters[semesters.length - 1];
    const activeSemester = semesters.find((sem) => sem._id === activeSemId);

    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            <header className="flex items-center justify-between border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-green-600" />
                    Semester Management
                </h1>
                <Button onClick={() => {
                    setSemesterModalOpen(true);
                    setSemesterErrors({});
                }} className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Create Semester
                </Button>
            </header>

            <section className="space-y-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    semesters.map((sem) => (
                        <div key={sem._id} className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{sem.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(sem.startDate)} - {formatDate(sem.endDate)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenQuarterModal(sem._id)}
                                        className="flex items-center gap-1 text-green-700"
                                    >
                                        <PlusCircle className="w-4 h-4" /> Quarter
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                {sem.quarters.map((qtr) => (
                                    <div key={qtr._id} className="flex justify-between items-center bg-gray-50 rounded-md px-4 py-3 border">
                                        <div>
                                            <p className="font-medium text-gray-800">{qtr.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(qtr.startDate)} - {formatDate(qtr.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Semester Modal */}
            <Dialog open={semesterModalOpen} onOpenChange={setSemesterModalOpen}>
                <DialogContent className="max-w-md rounded-xl border p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">New Semester</DialogTitle>
                    </DialogHeader>
                    {lastSemester && (
                        <p className="text-sm mb-3 text-gray-500">
                            Last semester ends on: <strong>{formatDate(lastSemester.endDate)}</strong>
                        </p>
                    )}
                    <div className="space-y-3">
                        {semesterErrors.title && <p className="text-red-500 text-sm">{semesterErrors.title}</p>}
                        <Input placeholder="Semester Title" value={semesterData.title} onChange={(e) => setSemesterData({ ...semesterData, title: e.target.value })} />

                        {semesterErrors.startDate && <p className="text-red-500 text-sm">{semesterErrors.startDate}</p>}
                        <Input type="date" value={semesterData.startDate} onChange={(e) => setSemesterData({ ...semesterData, startDate: e.target.value })} />

                        {semesterErrors.endDate && <p className="text-red-500 text-sm">{semesterErrors.endDate}</p>}
                        <Input type="date" value={semesterData.endDate} onChange={(e) => setSemesterData({ ...semesterData, endDate: e.target.value })} />

                        {semesterErrors.date && <p className="text-red-500 text-sm">{semesterErrors.date}</p>}
                        {semesterErrors.overlap && <p className="text-red-500 text-sm">{semesterErrors.overlap}</p>}

                        <Button onClick={handleCreateSemester} className="w-full">
                            Create Semester
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Quarter Modal */}
            <Dialog open={quarterModalOpen} onOpenChange={setQuarterModalOpen}>
                <DialogContent className="max-w-md rounded-xl border p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">New Quarter</DialogTitle>
                    </DialogHeader>
                    {activeSemester && (
                        <p className="text-sm mb-3 text-gray-500">
                            Semester duration: <strong>{formatDate(activeSemester.startDate)} - {formatDate(activeSemester.endDate)}</strong>
                        </p>
                    )}
                    <div className="space-y-3">
                        {quarterErrors.title && <p className="text-red-500 text-sm">{quarterErrors.title}</p>}
                        <Input placeholder="Quarter Title" value={quarterData.title} onChange={(e) => setQuarterData({ ...quarterData, title: e.target.value })} />

                        {quarterErrors.startDate && <p className="text-red-500 text-sm">{quarterErrors.startDate}</p>}
                        <Input type="date" value={quarterData.startDate} onChange={(e) => setQuarterData({ ...quarterData, startDate: e.target.value })} />

                        {quarterErrors.endDate && <p className="text-red-500 text-sm">{quarterErrors.endDate}</p>}
                        <Input type="date" value={quarterData.endDate} onChange={(e) => setQuarterData({ ...quarterData, endDate: e.target.value })} />

                        {quarterErrors.date && <p className="text-red-500 text-sm">{quarterErrors.date}</p>}
                        {quarterErrors.range && <p className="text-red-500 text-sm">{quarterErrors.range}</p>}
                        {quarterErrors.overlap && <p className="text-red-500 text-sm">{quarterErrors.overlap}</p>}

                        <Button onClick={handleCreateQuarter} className="w-full">
                            Create Quarter
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Semester;
