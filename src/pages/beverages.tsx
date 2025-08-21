import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Beverage } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import coffeeImage from "../assets/images/coffee-1.jpg";

import { useState } from "react";

export default function BeveragesPage() {
  const { data: beverages, error } = useSWR<Beverage[]>("/beverages");

  console.log("beverages", beverages);
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">เครื่องดื่ม</h1>
          <h2>รายการเครื่องดื่มทั้งหมด {count} </h2>
          <button onClick={() => setCount(count+1)} className="mt-4 bg-white text-black px-4 py-2 rounded">
            usestate เพิ่มเครื่องดื่ม
          </button>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการเครื่องดื่ม</h1>

            <Button
              component={Link}
              leftSection={<IconPlus />}
              to="/menu/create"
              size="xs"
              variant="primary"
              className="flex items-center space-x-2"
            >
              เพิ่มเครื่องดื่ม
            </Button>
            
          </div>

          {!beverages && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {beverages?.map((beverage) => (
              <div className="border border-solid border-neutral-200" key={beverage.id}>
                <img
                  src={beverage.imageUrl || coffeeImage}
                  alt={beverage.name}
                  className="w-full object-cover aspect-square"
                />
                <div className="p-4">
                    <h2 className="text-lg font-semibold line-clamp-2">{beverage.name}</h2>
                    <p className="text-xs text-neutral-500">{beverage.description}</p>
                    <p className="text-md font-bold text-green-500">ราคา {beverage.price}</p>
                </div>

                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/menu/order/${beverage.id}`} size="xs" variant="default">
                    สั่งซื้อ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
