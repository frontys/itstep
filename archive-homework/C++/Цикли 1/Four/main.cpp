#include <iostream>

using namespace std;

int main()
{
    int a;
    int result = 1;

    cout << "Enter a number (1 - 20) >>> ";
    cin >> a;

    if (a >= 1 && a <= 20)
    {
        for (int f = a; f <= 20; f++)
        {
            result = result * f;
        }

    cout << "Dobutok " << a << " = " << result << endl;
    }
    else
    {
        cout << "Invalid input" << endl;
    }

    system("pause");
}