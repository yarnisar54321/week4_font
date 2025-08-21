import useSWR from "swr";
import { Book } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, Button, Container, Divider, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [dateValue, setDateValue] = useState<Date | null>(new Date());

  const { data: book, isLoading, error } = useSWR<Book>(`/books/${bookId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const { data: genres } = useSWR("/genres", (url) => axios.get(url).then(res => res.data));

  const bookEditForm = useForm({
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

  const handleSubmit = async (values: typeof bookEditForm.values) => {
    try {
      setIsProcessing(true);
      const patchValues = {
        ...values,
        genreId: Number(values.genreId),
      };
      console.log("values", patchValues);
      await axios.patch(`/books/${bookId}`, patchValues);
      notifications.show({
        title: "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (error.response?.status === 400) {
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

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/books/${bookId}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ",
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการลบ",
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

  useEffect(() => {
    if (!isSetInitialValues && book) {
      bookEditForm.setInitialValues({
        title: book.title,
        author: book.author,
        publishedAt: new Date(book.publishedAt),
        description: book.description,
        summary: book.summary ?? "",
        genreId: book.genre?.id ?? 1,
      });
      bookEditForm.setValues({
        title: book.title,
        author: book.author,
        publishedAt: new Date(book.publishedAt),
        description: book.description,
        summary: book.summary,
        genreId: book.genre?.id ?? 1,
      });
      setIsSetInitialValues(true);
    }
  }, [book, bookEditForm, isSetInitialValues, dateValue, setDateValue]);

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">แก้ไขข้อมูลหนังสือ</h1>

          {isLoading && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          {!!book && (
            <>
              <form onSubmit={bookEditForm.onSubmit(handleSubmit)} className="space-y-8">
                <TextInput
                  label="ชื่อหนังสือ"
                  placeholder="ชื่อหนังสือ"
                  {...bookEditForm.getInputProps("title")}
                />

                <TextInput
                  label="ชื่อผู้แต่ง"
                  placeholder="ชื่อผู้แต่ง"
                  {...bookEditForm.getInputProps("author")}
                />

                <DateTimePicker
                  label="วันที่พิมพ์"
                  placeholder="วันที่พิมพ์"
                  value={bookEditForm.values.publishedAt}
                  onChange={(date) => {
                    setDateValue(date);
                    if (date) {
                      bookEditForm.setFieldValue("publishedAt", date);
                    }
                    console.log("Selected date:", date);
                  }}
                  // {...bookEditForm.getInputProps("publishedAt")}
                />

                {/* TODO: เพิ่มรายละเอียดหนังสือ */}
                <TextInput
                  label="รายละเอียดหนังสือ"
                  placeholder="รายละเอียดหนังสือ"
                  {...bookEditForm.getInputProps("description")}
                />
                {/* TODO: เพิ่มเรื่องย่อ */}
                <TextInput
                  label="เรื่องย่อ"
                  placeholder="เรื่องย่อ"
                  {...bookEditForm.getInputProps("summary")}
                />
                {/* TODO: เพิ่มหมวดหมู่(s) */}
                <TextInput
                  label="หมวดหมู่"
                  placeholder="หมวดหมู่ (ถ้ามี)"
                  component="select"
                  {...bookEditForm.getInputProps("genreId")}
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

                <div className="flex justify-between">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำนเนินการลบหนังสือเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้
                          </span>
                        ),
                        labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          handleDelete();
                        },
                        confirmProps: {
                          color: "red",
                        },
                      });
                    }}
                  >
                    ลบหนังสือนี้
                  </Button>

                  <Button type="submit" loading={isLoading || isProcessing}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </form>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
