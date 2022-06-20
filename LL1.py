'''
Author: LetMeFly
Date: 2022-06-20 09:03:00
LastEditors: LetMeFly
LastEditTime: 2022-06-20 21:35:21
'''
class ToN:  # 非终结符或终结符
    name = ''
    isT = False

    def __init__(self, **kwargs) -> None:
        for key, val in kwargs.items():
            setattr(self, key, val)


class T(ToN):  # 终结符
    def __init__(self, **kwargs) -> None:
        kwargs['isT'] = True
        super().__init__(**kwargs)


class N(ToN):  # 非终结符
    def __init__(self, **kwargs) -> None:
        kwargs['isT'] = False
        super().__init__(**kwargs)

class Production:  # 产生式
    T()
    N()


a = ToN(a = 'sfs')
print(a.a)
