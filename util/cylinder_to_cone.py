rate = 1.0

step = 1 / 14
for i in range(1, 15):
    print(f'{i:2}: {rate - step * i:.2f}')