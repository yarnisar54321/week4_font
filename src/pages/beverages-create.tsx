import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, TextInput, NumberInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Beverage } from "../lib/models";


export default function BeverageCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const beverageCreateForm = useForm({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเครื่องดื่ม"),
      price: isNotEmpty("กรุณาระบุราคา"),
      description: isNotEmpty("กรุณาระบุรายละเอียดเครื่องดื่ม"),
      imageUrl: isNotEmpty("กรุณาระบุ URL ของรูปภาพ"),
    },
  });

  const handleSubmit = async (values: typeof beverageCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<{
        message: string;
        beverage: Beverage;
      }>(`/beverages`, values); 
        console.log("response", response.data);
      notifications.show({
        title: "เพิ่มข้อมูลเครื่องดื่มสำเร็จ",
        message: "ข้อมูลเครื่องดื่มได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menu`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มเครื่องดื่มในระบบ</h1>

          <form onSubmit={beverageCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อเครื่องดื่ม"
              placeholder="ชื่อเครื่องดื่ม"
              {...beverageCreateForm.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...beverageCreateForm.getInputProps("price")}
            />

            <TextInput
              label="รายละเอียดเครื่องดื่ม"
              placeholder="รายละเอียดเครื่องดื่ม"
              {...beverageCreateForm.getInputProps("description")}
            />

            <TextInput
              label="URL รูปภาพ"
              placeholder="URL รูปภาพ"
              {...beverageCreateForm.getInputProps("imageUrl")}
            />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              บันทึกข้อมูล
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
