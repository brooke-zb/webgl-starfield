import math
from PIL import Image

def get_color(x, y, w=256, h=256):
    max_dis_side =  w / 2
    dis_center = math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2)
    rate = max(max_dis_side - dis_center, 0) / max_dis_side * 2.1
    ans = int(round(255 * (math.exp(rate - 1.9)), 0)) - 40

    # # debug
    # if x == y and x <= 128:
    #     print(f'x: {x}, y: {y}, dis: {round(dis_center, 2)}, ans: {ans}')

    return ans

# 生成径向渐变星星图片
def gen_normal_star():
    image = Image.new('L', (256, 256))
    # 从边缘到中心渐变
    for x in range(256):
        for y in range(256):
            color = get_color(x, y)
            image.putpixel((x, y), color)
    # image.save('../public/assets/textures/star.jpg')
    image.save('./star.jpg', quality=90)


def get_color2(x, y, w=256, h=256):
    max_dis_side =  w / 2
    dis_center = math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2)
    rate = max(max_dis_side - dis_center, 0) / max_dis_side * 2
    ans = int(round(255 * (math.exp(rate - 1.9)), 0)) - 40

    # 两个对角线上的点也要变亮
    if (abs(x - (256 - y)) % 256 < 100 or abs(x - y) % 256 < 100):
        tmp = max(100 - (abs(x - (256 - y)) % 256) * 5, 100 - (abs(x - y) % 256) * 5)
        ans = max(tmp + ans - math.floor(dis_center / 3), ans)

    # # debug
    # if x == y and x <= 128:
    #     print(f'x: {x}, y: {y}, dis: {round(dis_center, 2)}, ans: {ans}')

    return ans

# 生成带四角的星星图片
def gen_shining_star():
    image = Image.new('L', (256, 256))
    # 从边缘到中心渐变
    for x in range(256):
        for y in range(256):
            color = get_color2(x, y)
            image.putpixel((x, y), color)
    image.save('../public/assets/textures/star.jpg', quality=85)

if __name__ == '__main__':
    # gen_normal_star()
    gen_shining_star()