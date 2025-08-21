import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Book } from "../lib/models";
import { DateTimePicker } from "@mantine/dates";
import useSWR from "swr";


export default function BookCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const { data:genres } = useSWR("/genres", (url) => axios.get(url).then(res => res.data));

  const bookCreateForm = useForm({
    initialValues: {
      title: "",
      author: "",
      publishedAt: new Date(),
      description: "",
      summary: "",
      genreId: 1,
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      publishedAt: isNotEmpty("กรุณาระบุวันที่พิมพ์หนังสือ"),
      description: isNotEmpty("กรุณาระบุรายละเอียดหนังสือ"),
      summary: isNotEmpty("กรุณาระบุเรื่องย่อหนังสือ"),
      genreId: isNotEmpty("กรุณาเลือกหมวดหมู่หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof bookCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<{
        message: string;
        book: Book;
      }>(`/books`, values); 
      
      notifications.show({
        title: "เพิ่มข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${response.data.book.id}`);
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
          <h1 className="text-xl">เพิ่มหนังสือในระบบ</h1>

          <form onSubmit={bookCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อหนังสือ"
              placeholder="ชื่อหนังสือ"
              {...bookCreateForm.getInputProps("title")}
            />

            <TextInput
              label="ชื่อผู้แต่ง"
              placeholder="ชื่อผู้แต่ง"
              {...bookCreateForm.getInputProps("author")}
            />

            <DateTimePicker
              label="วันที่พิมพ์"
              placeholder="วันที่พิมพ์"
              {...bookCreateForm.getInputProps("publishedAt")}
            />

            {/* TODO: เพิ่มรายละเอียดหนังสือ */}
            <TextInput
              label="รายละเอียดหนังสือ"
              placeholder="รายละเอียดหนังสือ"
              {...bookCreateForm.getInputProps("description")}
            />
            {/* TODO: เพิ่มเรื่องย่อ */}
            <TextInput
              label="เรื่องย่อ"
              placeholder="เรื่องย่อ"
              {...bookCreateForm.getInputProps("summary")}
            />
            {/* TODO: เพิ่มหมวดหมู่(s) */}
            <TextInput
              label="หมวดหมู่"
              placeholder="หมวดหมู่ (ถ้ามี)"
              component="select"
              {...bookCreateForm.getInputProps("genreId")}
            >
                <option value="">เลือกหมวดหมู่</option>
                {/* เพิ่มเงื่อนไขตรวจสอบว่า genres มีข้อมูลและเป็นอาร์เรย์ก่อน map */}
                {genres && Array.isArray(genres) && genres.map((genre: { id: number; title: string }) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.title}
                  </option>
                ))}
            </TextInput>

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
