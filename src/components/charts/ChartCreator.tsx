import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCharts } from "../../hooks/useCharts";
import { createChartSchema, type CreateChartFormData, } from "../../lib/validations";
import { CHART_TYPES, CHART_TYPE_LABELS } from "../../lib/constants";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { ChartType, ExcelData } from "../../types";

interface ChartCreatorProps {
  uploadId: string;
  excelData: ExcelData;
  onChartCreated?: () => void;
}

export const ChartCreator = ({ uploadId, excelData, onChartCreated }: ChartCreatorProps) => {
  const [open, setOpen] = useState(false);
  const { createChart } = useCharts();

  const form = useForm<CreateChartFormData>({
    resolver: zodResolver(createChartSchema),
    defaultValues: {
      xAxis: "",
      yAxis: "",
      chartType: CHART_TYPES.BAR,
      title: "",
    },
  });

  const onSubmit = async (data: CreateChartFormData) => {
    try {
      await createChart(uploadId, { ...data, chartType: data.chartType as ChartType });
      form.reset();
      setOpen(false);
      onChartCreated?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const chart2DTypes = [
    CHART_TYPES.BAR,
    CHART_TYPES.LINE,
    CHART_TYPES.PIE,
    CHART_TYPES.SCATTER,
  ];

  const chart3DTypes = [
    CHART_TYPES.COLUMN_3D,
    CHART_TYPES.BAR_3D,
    CHART_TYPES.LINE_3D,
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Chart</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chart Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter chart title (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="xAxis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X-Axis</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select X-Axis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {excelData.headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yAxis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Y-Axis</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Y-Axis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {excelData.headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chartType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chart Type</FormLabel>
                  <Tabs defaultValue="2d" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="2d">2D Charts</TabsTrigger>
                      <TabsTrigger value="3d">3D Charts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="2d" className="space-y-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select 2D chart type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chart2DTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {CHART_TYPE_LABELS[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    <TabsContent value="3d" className="space-y-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select 3D chart type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chart3DTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {CHART_TYPE_LABELS[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Chart"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};