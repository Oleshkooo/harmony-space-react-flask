l = [
    ['admin', '123456'],
    ['admiasdn', '123456asd']
]

d = dict(
    [
        zip(['username', 'password'], i) for i in l
    ]
)

print(d)