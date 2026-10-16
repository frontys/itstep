#include <iostream>

using namespace std;

int main()
{
    int sum = 0;
    int f = 0;

    while (f < 1000)
    {
        sum = sum + f;
        f = f + 1;
    }

    double avg = sum / 1000.0;

    cout << "Srednee arifmeticheskoe >>> " << avg << endl;
    system("pause");
}