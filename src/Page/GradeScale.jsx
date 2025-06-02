import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, RefreshCw, Check, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link } from "react-router-dom";

export default function GradeScaleForm() {
  const [grades, setGrades] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      await axiosInstance
        .get("gradebook/getGradingScale")
        .then((res) => {
          console.log(res);
          setGrades(res.data.scale);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };
    fetchGrades();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <section className="flex justify-between">
            <CardTitle>Grade Scale</CardTitle>
            <Link to={"/admin/gradescale/managegradescale"}>
              <Button className={"bg-green-500 hover:bg-green-600"}>Manage Grade Scale</Button>
            </Link>
          </section>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
              <Loader className="animate-spin" />
            </div>
          )}
          {grades?.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 font-medium text-sm text-gray-500 mb-2">
                <div>Grade</div>
                <div>Range</div>
                <div>Percentage</div>
              </div>
              {grades.map((grade, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 items-center border-b border-gray-100 pb-2"
                >
                  <Badge className={`font-bold text-sm px-3 py-1 bg-green-400`}>
                    {grade.grade}
                  </Badge>
                  <div className="text-sm">
                    {grade.min}% - {grade.max}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${grade.max - grade.min + 1}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
              <p>No grades added yet please create</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
