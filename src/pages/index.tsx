import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-left col-span-2">
             ร้านกาแฟนี้เปิดให้บริการเพื่อให้บริการเครื่องดื่มและหนังสือสำหรับผู้ที่ต้องการพักผ่อน
            และอ่านหนังสือในบรรยากาศที่เงียบสงบ เรามีเครื่องดื่มหลากหลายชนิด
            รวมถึงกาแฟสด ชา และน้ำผลไม้สด
            นอกจากนี้ เรายังมีหนังสือหลากหลายประเภท
            ให้คุณได้เลือกอ่านตามความสนใจของคุณ
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        <p className="text-right mt-8">
          ปัจจุบันค่าเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของ .... <br />
         
          ญาณิศา จันทะสะเร รหัสประจำตัวนักศึกษา 66070052  เเละร้านกาเเฟเเห่งนี้มาจากการที่เราชื่นชอบที่จะดื่มกาเเฟ เเละชา
           เราใช้เวลาหลายปีศึกษาศาสตร์แห่งกาแฟอย่างลึกซึ้ง เพื่อให้ทุกแก้วที่คุณได้รับเต็มไปด้วยคุณภาพ สำหรับเรา "เมล็ดแรก"คือที่ที่คุณจะได้สัมผัสความอบอุ่น ผ่อนคลาย และมิตรภาพ เราชอบที่จะพูดคุยกับลูกค้า รับฟังเรื่องราว และเป็นส่วนหนึ่งในการสร้างสรรค์ช่วงเวลาดีๆ ของคุณ
        </p>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
