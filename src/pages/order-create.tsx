import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, Text, Card, Group, Image, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Beverage, Order } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconShoppingCart } from "@tabler/icons-react";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function OrderCreatePage() {
  const { beverageId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch beverage detailsx
  const { data: beverage, error } = useSWR<Beverage>(
    beverageId ? `/beverages/${beverageId}` : null
  );

  const orderForm = useForm({
    initialValues: {
      quantity: 1,
      note: "",
    },

    validate: {
      quantity: (value) => {
        if (!value || value < 1) {
          return "กรุณาระบุจำนวนที่มากกว่า 0";
        }
        return null;
      },
      note: (value) => {
        if (value && value.length > 200) {
          return "หมายเหตุไม่ควรเกิน 200 ตัวอักษร";
        }
        return null;
      },

    },
  });

  const handleSubmit = async (values: typeof orderForm.values) => {
    if (!beverageId) return;

    try {
      setIsProcessing(true);
      const orderData = {
        beverageId: parseInt(beverageId),
        quantity: values.quantity,
        note: values.note,
        orderDate: new Date().toISOString(),
      };

      await axios.post<{
        message: string;
        order: Order;
      }>(`/orders`, orderData);

      notifications.show({
        title: "สั่งซื้อสำเร็จ",
        message: `สั่งซื้อ ${beverage?.name} จำนวน ${values.quantity} รายการเรียบร้อยแล้ว`,
        color: "teal",
      });

      navigate(`/menu`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status === 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            message: "กรุณาลองใหม่อีกครั้งในภายหลัง",
            color: "red",
          });
        } else {
          notifications.show({
            title: "เกิดข้อผิดพลาด",
            message: "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!beverageId) {
    return (
      <Layout>
        <Container>
          <Text color="red">ไม่พบรหัสเครื่องดื่ม</Text>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Text color="red">เกิดข้อผิดพลาดในการโหลดข้อมูลเครื่องดื่ม</Text>
        </Container>
      </Layout>
    );
  }

  if (!beverage) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const totalPrice = beverage.price * orderForm.values.quantity;

  return (
    <Layout>
      <Container size="md" py="xl">
        <Group mb="lg">
          <IconShoppingCart size={32} />
          <Text size="xl" fw={700}>สั่งซื้อเครื่องดื่ม</Text>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
          <Group align="flex-start">
            <Image
              src={beverage.imageUrl || coffeeImage}
              alt={beverage.name}
              width={200}
              height={200}
              radius="md"
            />
            <div style={{ flex: 1 }}>
              <Text size="xl" fw={600} mb="xs">
                {beverage.name}
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                {beverage.description}
              </Text>
              <Text size="lg" fw={700} c="green">
                ราคา ฿{beverage.price}
              </Text>
            </div>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <form onSubmit={orderForm.onSubmit(handleSubmit)}>
            <Text size="lg" fw={600} mb="md">
              รายละเอียดการสั่งซื้อ
            </Text>

            <NumberInput
              label="จำนวน"
              placeholder="กรุณาระบุจำนวน"
              min={1}
              max={100}
              {...orderForm.getInputProps("quantity")}
              mb="md"
            />

            <TextInput
              label="หมายเหตุ"
              placeholder="กรุณาระบุหมายเหตุ"
              {...orderForm.getInputProps("note")}
              mb="md"
            />

            <Divider my="md" />

            <Group justify="space-between" mb="lg">
              <Text size="lg" fw={600}>
                ราคารวม
              </Text>
              <Text size="xl" fw={700} c="green">
                ฿{totalPrice.toFixed(2)}
              </Text>
            </Group>

            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => navigate("/menu")}
                disabled={isProcessing}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                loading={isProcessing}
                leftSection={<IconShoppingCart size={16} />}
              >
                ยืนยันการสั่งซื้อ
              </Button>
            </Group>
          </form>
        </Card>
      </Container>
    </Layout>
  );
}